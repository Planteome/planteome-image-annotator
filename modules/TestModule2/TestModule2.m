function TestModule2(mex_url, access_token, image_url)
	% init bisque
	session = bq.Session(mex_url, access_token);
	session.update('Initializing...');
	image = session.fetch(image_url);
	I = image.fetch();
	
	polylines = session.mex.findNodes('//tag[@name="inputs"]/tag[@name="resource_url"]/gobject[@name="stroke"]/polyline');
	
	polygon = polylines{1};
	outputs = session.mex.addtag('outputs');
	imref   = outputs.addtag('img', image_url, 'image');
	obj     = imref.addGobject('polygon', 'segment', polygon);
	session.update('Done.');
	session.finish();
end

