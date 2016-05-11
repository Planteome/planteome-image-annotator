window.onload = function(){

segmentationLayer = 1;

function setSegLayer(val){
  segmentationLayer = val;
}

myButton = document.createElement("input");
myButton.type = "button";
myButton.value = "FG";
myButton.onclick = "setSegLayer(1)";
editorDiv = document.getElementById("inputs");
editorDiv.appendChild(myButton);

myButton2 = document.createElement("input");
myButton2.type = "button";
myButton2.value= "BG";
myButton2.onclick = "setSegLayer(0)";
editorDiv.appendChild(myButton2);



ImgEdit.prototype.basic_polygon = function (type, parent, e, x, y) {
   
    var v = this.viewer.current_view;
    var g = this.current_gob;
    var me = this;
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
        g.vertices.push (new BQVertex (pt.x, pt.y, v.z, v.t, segmentationLayer, index));

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


};