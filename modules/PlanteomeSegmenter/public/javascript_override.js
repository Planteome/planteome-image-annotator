segmentationLayer = 1;

function setSegLayer(val){
    segmentationLayer = val;
}

window.onload = function(){




myButton = document.createElement("input");
myButton.type = "button";
myButton.value = "FG";
myButton.onclick = function(){
    segmentationLayer=1-segmentationLayer;
    if(segmentationLayer==0) myButton.value = "BG";
    else myButton.value = "FG";
};
editorDiv = document.getElementById("inputs");
editorDiv.appendChild(myButton);
/*
myButton2 = document.createElement("input");
myButton2.type = "button";
myButton2.value= "BG";
myButton2.onclick = function(){
    segmentationLayer=0;
    myButton.bgcolor=myButton2.bgcolor;
    myButton2.bgcolor="#FF0000";
};
editorDiv.appendChild(myButton2);
*/


ImgEdit.prototype.basic_polygon = function (type, parent, e, x, y) {
    //alert(segmentationLayer)
    var v = this.viewer.current_view;
    var g = this.current_gob;
    var me = this;
    //alert(v.z);
    parent = parent || this.global_parent;

    if (g == null) {
        g = new BQGObject(type);
        if (parent) {
            parent.addgobjects(g);
            g.edit_parent = parent;
        } else
            this.viewer.image.addgobjects(g);
    }

    var pt = v.inverseTransformPoint(x,y);
    var index = g.vertices.length;
    var prev = index>0?g.vertices[index-1]:{x:-1,y:-1};


    //if we want to close this sucker without adding more points
    if(index > 2){
        //var ip = v.inverseTransformPoint(g.vertices[0].x,g.vertices[0].y);
        var dx = g.vertices[0].x - pt.x;
        var dy = g.vertices[0].y - pt.y;
        var dp = dx*dx + dy*dy;

        if(dp < 128/this.renderer.scale()){
            this.finish_add(g, g.edit_parent);
            this.renderer.resetShapeCornerFill();

            return;
        };
    }

    if (e.evt.detail==1 && pt.x && pt.y && !isNaN(pt.x) && !isNaN(pt.y) && pt.x!==prev.x && pt.y!==prev.y)
        g.vertices.push (new BQVertex (pt.x, pt.y, segmentationLayer, v.t,null, index));

    // Double click ends the object otherwise add points
    this.current_gob = (e.evt.detail > 1)?null:g;

    if (!this.current_gob){
        this.finish_add(g, g.edit_parent);
        return;
    }
    else{
        if(g.shape)
            g.shape.sprite.remove();
        this.visit_render.visitall(g, [v]);
        g.shape.postEnabled = false;
        //this.renderer.setmousemove(callback({shape: g.shape, start: [x,y]}, g.shape.onDragCreate));
        this.renderer.setmousemove(function(e){
            g.shape.onDragCreate(e,[x,y]);
            me.display_gob_info(g);
        });

        this.begin_add(g, g.edit_parent);
    }
};

CanvasShape.prototype.isVisible = function (z,t, tolerance_z) {
    
   
    //test visible takes the shape and tests if its bounding box is intersected by
    //the current view plane
    if(!this.visibility) return false; //visibility is a tag passed from the tagger
    
    var test_visible_dim = function(min, max,  pos_view, tolerance ) {
        return (pos_view >= min - 0.5*tolerance && pos_view <= max + 0.5*tolerance);
    }
    
    var viewstate = this.renderer.viewer.current_view;
    
    //if(!pos) return false;
    var proj = viewstate.imagedim.project,
    proj_gob = viewstate.gob_projection,
    
    tolerance_z = tolerance_z || viewstate.gob_tolerance.z || 1.0;
    tolerance_z = tolerance_z + 5;
    var tolerance_t = viewstate.gob_tolerance.t || 1.0;
    if(!this.bbox)
        this.bbox = this.caclBbox();
    var bbox = this.bbox;
    var min = bbox.min;
    var max = bbox.max;
    var t = t ? t : viewstate.t;
    var z = z ? z : viewstate.z;
    if (proj_gob==='all') {
        return true;
    } else if (proj === 'projectmaxz' || proj === 'projectminz' || proj_gob==='Z') {
        return test_visible_dim(min[3], max[3], t, tolerance_t);
    } else if (proj === 'projectmaxt' || proj === 'projectmint' || proj_gob==='T') {
        return test_visible_dim(min[2], max[2], z, tolerance_z);
    } else if (!proj || proj === 'none') {
        return (test_visible_dim(min[2], max[2], z, tolerance_z) &&
        test_visible_dim(min[3], max[3], t, tolerance_t));
    }
    return true;
}

};
