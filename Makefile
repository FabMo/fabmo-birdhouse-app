svgcode.fma: clean *.html js/*.js js/libs/*.js icon.png package.json
	zip fabmo-birdhouse-app.fma *.html js/*.js js/libs/*.js icon.png package.json

.PHONY: clean

clean:
	rm -rf fabmo-birdhouse-app.fma
