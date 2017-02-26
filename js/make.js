function make(){

	paths=[]

	pgScale = 100

	for(i=0;i<polygons.length;i++){

		offset=[]

		offset.push(polygons[i].curves)
	
		if(polygons[i].holes.length>0){
			for(j=0;j<polygons[i].holes.length;j++){
				offset.push(polygons[i].holes[j])

			}
		}
	
		ClipperLib.JS.ScaleUpPaths(offset, pgScale)

		co = new ClipperLib.ClipperOffset(0.25, 0.25)
		co.AddPaths(offset, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon)
		cutout = new ClipperLib.Paths()

		t = tool*pgScale

		co.Execute(cutout,t)

		ClipperLib.JS.ScaleDownPaths(offset, pgScale)
		ClipperLib.JS.ScaleDownPaths(cutout, pgScale)

		paths.push(cutout)

	}

	offset=paths

	draw()

	cutDepth = ((thickness/10)+0.015).toFixed(3)

	pt= Math.ceil(cutDepth/((tool/10)*2))  //passes
	pd = parseFloat(cutDepth/pt) //depth of pass


	for(i=0;i<offset.length;i++){


		if(document.getElementById('output').value=='sbp'){
			sbp="MS,0.5,0.25\n"
			sbp+="JZ,0.25\n"
			sbp+="SO,1,1\n"
			sbp+="PAUSE 3\n"
		}
		else if(document.getElementById('output').value=='gcode'){
			sbp="g20\n"
			sbp+="g0z0.25\n"
			sbp+="m3\n"
			sbp+="g4p3\n"
		}
		else if(document.getElementById('output').value=='dxf'){
			dxf = "0\nSECTION\n2\nENTITIES\n999\nw4rd.com\n0\n"
		}

		yOffset = 0
		if((i<2)||(i==2)){
			xOffset = birdhouse.width/2
		}
		else if(i==2){
			xOffset = birdhouse.depth/2
		}
		else if(i==3){
			xOffset = birdhouse.width/2
			yOffset = thickness/10
		}
		else if(i==4){
			xOffset = thickness/10
		}
		else if(i==5){
			xOffset = 0
			
		}


		for(j=offset[i].length-1;j>=0;j--){

			if(document.getElementById('output').value=='sbp'){

				sbp+="J2," + (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "," + (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						sbp+="MZ,-"+cutDepth+"\n"
					}
					else{
						sbp+="MZ,-" + (p*pd).toFixed(3) + "\n"
					}
					for(k=1;k<offset[i][j].length;k++){
						sbp+="M2," + (xOffset+(offset[i][j][k].X/10)).toFixed(3) + "," + (yOffset+(offset[i][j][k].Y/10)).toFixed(3) + "\n"
					}
					sbp+="M2," + (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "," + (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n"
				}
				sbp+="JZ,0.125\n"
			}
			else if(document.getElementById('output').value=='gcode'){
				sbp+="g0x" + (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "y" + (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n"

				for(p=1;p<=pt;p++){
					if(p==pt){
						sbp+="g1z-"+cutDepth+"f15\n"
					}
					else{
						sbp+="g1z-" + (p*pd).toFixed(3) + "f15\n"
					}
					for(k=1;k<offset[i][j].length;k++){
						if(k==1){
							sbp+="g1x" + (xOffset+(offset[i][j][k].X/10)).toFixed(3) + "y" + (yOffset+(offset[i][j][k].Y/10)).toFixed(3) + "f30\n"
						}
						else{
							sbp+="g1x" + (xOffset+(offset[i][j][k].X/10)).toFixed(3) + "y" + (yOffset+(offset[i][j][k].Y/10)).toFixed(3) + "\n"
						}
					}
					sbp+="g1x" + (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "y" + (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n"
				}
				sbp+="g0z0.125\n"

			}
			else{
				dxf+="POLYLINE\n8\n0\n70\n1\n0\n"

				dxf+="VERTEX\n8\n0\n10\n"
				dxf+= (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "\n20\n"
				dxf+= (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n0\n"

				for(k=0;k<offset[i][j].length;k++){
					dxf+="VERTEX\n8\n0\n10\n"
					dxf+= (xOffset+(offset[i][j][k].X/10)).toFixed(3) + "\n20\n"
					dxf+= (yOffset+(offset[i][j][k].Y/10)).toFixed(3) + "\n0\n"
				}

				dxf+="VERTEX\n8\n0\n10\n"
				dxf+= (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "\n20\n"
				dxf+= (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n0\n"

				dxf+="SEQEND\n0\n"
			}			
		}

	if(document.getElementById('output').value=='sbp'){
		sbp+="JZ,0.25\n"
		sbp+="SO,1,0\n"
		sbp+="J2,0,0\n"	
	}
	else if(document.getElementById('output').value=='gcode'){
		sbp+="g0z0.25\n"
		sbp+="m5\n"
		sbp+="g0x0y0\n"
	}

	if(i==0){
		partName='birdhouseFront'
	}
	else if(i==1){
		partName='birdhouseBack'
	}
	else if(i==2){
		partName='birdhouseLeftRight'
	}
	else if(i==3){
		partName='birdhouseBottom'
	}
	else if(i==4){
		partName='birdhouseTopLeft'
	}
	else if(i==5){
		partName='birdhouseTopRight'
	}

	if(document.getElementById('output').value=='sbp'){
		ext = '.SBP'
	}
	else if(document.getElementById('output').value=='gcode'){
		ext = '.nc'
	}
	

	if(document.getElementById('output').value!='dxf'){

		fabmo.submitJob({
			file : sbp,
			filename : partName + ext,
			name : partName,
			description :  '1/8\"endmill'
		})

	}
	else{

		dxf+="ENDSEC\n0\nEOF"

		var link = document.getElementById("downloadLink")

		link.setAttribute("href", "data:text/plain;base64," + btoa(dxf))
		link.setAttribute("download", partName + ".dxf")
		link.click()

	}
	
	}


}
