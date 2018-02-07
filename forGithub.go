package main

import (
	"fmt"
	"io/ioutil"
	"regexp"
	"strings"

	"github.com/spf13/viper"
	"github.com/tdewolff/minify"
	"github.com/tdewolff/minify/css"
	"github.com/tdewolff/minify/js"
	"github.com/tdewolff/minify/json"
)

var m *minify.M

func init() {
	m = minify.New()
	m.AddFunc("text/css", css.Minify)
	m.AddFunc("text/js", js.Minify)
	m.AddFuncRegexp(regexp.MustCompile("[/+]json$"), json.Minify)
}

func main() {
	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	errViperRead := viper.ReadInConfig()
	if errViperRead != nil {
		panic(fmt.Errorf("Fatal error config file: %s", errViperRead))
	}

	var jsonLink = viper.GetString("jsonLink")

	replace("./src/index.html", "./index.html", []string{"../src/", "http://localhost:8080", "loc_data = r.response.data;"}, []string{"./static/", jsonLink, "loc_data = r.response;"})

	replace("./src/data.json", "./data.json", []string{"name", "url", "locations", "loc", "country"}, []string{"n", "u", "ls", "l", "c"})
	replace("./src/render.js", "./static/render.js", []string{"e.name", "e.url", "e.locations", "e.loc", "e.country", "].loc", "].country"}, []string{"e.n", "e.u", "e.ls", "e.l", "e.c", "].l", "].c"})
	replace("./src/index-main.js", "./static/index-main.js", []string{"].locations;", "].loc;", "].country;"}, []string{"].ls;", "].l", "].c"})

	// NOTE THAT SOME FILES TO BE MINIFIED ARE IN STATIC
	minifyOnly("./static/render.js", "./static/render.js", "text/js")
	minifyOnly("./static/index-main.js", "./static/index-main.js", "text/js")
	minifyOnly("./src/index-main.css", "./static/index-main.css", "text/css")
	minifyOnly("./data.json", "./data.json", "application/json")

	/*MINIFY
	Json
	render
	index-main.js
	css
	*/

}

func replace(path, newPath string, replaceThis, withThis []string) {
	read, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}

	if len(replaceThis) != len(withThis) {
		panic("-_-")
	}

	//fmt.Println(path)

	oldContent := read
	var newContents string

	for i := 0; i < len(replaceThis); i++ {
		newContents = strings.Replace(string(oldContent), replaceThis[i], withThis[i], -1)
		oldContent = []byte(newContents)
	}

	err = ioutil.WriteFile(newPath, []byte(newContents), 0)
	if err != nil {
		panic(err)
	}

}

func minifyOnly(path, newPath, mediatype string) {
	read, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}

	read, err = m.Bytes(mediatype, read)
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile(newPath, read, 0)
	if err != nil {
		panic(err)
	}
}
