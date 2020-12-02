Demo files for my "Intro to D3" tech talk at the [ECAL Tech Center](http://ecaltech.com/)

# Helpful links

- [The Hitchhiker’s Guide to d3.js](https://medium.com/@enjalot/the-hitchhikers-guide-to-d3-js-a8552174733a) - A nice overview of the ecosystem and reasons to use d3
- [The official quick start](https://d3js.org/#introduction)
- [The official longer tutorial](https://observablehq.com/@d3/learn-d3)
- [The API documentation](https://github.com/d3/d3/blob/master/API.md)
- [An intro to the .join() function](https://observablehq.com/@d3/selection-join) that replaces the General Update Pattern:
- [A cool intro to d3-force](https://wattenberger.com/blog/d3-force) for physics simulation in your dataviz
- [A Big List of tutorials](https://github.com/d3/d3/wiki/Tutorials)

# Getting started

Install this small server:

```
npm install -g reload
```

And launch it by running this command inside the project folder:

```
reload
```

[Optional] To get a proper linting and IntelliSense experience, run:

```
npm install
```

Side note: The file `global.d.ts` might be optional depending on how smart your editor is.

# Credits and sources

Project demo inspired by [showyourstripes.info](https://showyourstripes.info/)

Data from:

- [https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html](https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html)

Used libraries:

- [D3.js](https://d3js.org/)
- The [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic) plugin
