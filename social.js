/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* ###################### metabook/social.js ###################### */

/* Copyright (C) 2009-2017 beingmeta, inc.

   This file implements basic features for browsing glosses based on
   their "sources" --- the reasons they're overlaid on the reader's
   book in the first place.

   This file is part of metaBook, a Javascript/DHTML web application for reading
   large structured documents.

   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/
/* jshint browser: true */
/* global metaBook: false */

/* Initialize these here, even though they should always be
   initialized before hand.  This will cause various code checkers to
   not generate unbound variable warnings when called on individual
   files. */
// var fdjt=((typeof fdjt !== "undefined")?(fdjt):({}));
// var metaBook=((typeof metaBook !== "undefined")?(metaBook):({}));
// var Knodule=((typeof Knodule !== "undefined")?(Knodule):({}));

(function(){
    "use strict";

    var fdjtString=fdjt.String;
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var RefDB=fdjt.RefDB, $ID=fdjt.ID;

    var getInitials=fdjtString.getInitials;
    var addClass=fdjtDOM.addClass, dropClass=fdjtDOM.dropClass;
    var hasClass=fdjtDOM.hasClass, toggleClass=fdjtDOM.toggleClass;
    var mbicon=metaBook.icon;
    var mB=metaBook;

    /* Social UI components */

    function addSource(info,withgloss){
        if (typeof info === 'string') info=RefDB.resolve(info);
        var humid=info.humid;
        if (!(info.name)) return;
        if (withgloss) {
            var icon=$ID("SOURCEICON"+humid);
            if (!(icon)) { // Add icon to the sources bar
                var pic=(info._pic)||(info.pic)||
                    ((info.fbid)&&
                     ("https://graph.facebook.com/"+info.fbid+
                      "/picture?type=square"));
                var kind=info.kind;
                if (pic) {}
                else if ((kind===':CIRCLE')||(info.iscircle))
                    pic=mbicon("readingcircle",64,64);
                else pic=mbicon("sideguide",64,64);
                if (pic)
                    icon=fdjtDOM.Image
                (pic,".button.source",info.name|info.kind,
                 ("click to show/hide glosses from "+info.name));
                else {
                    icon=fdjtDOM("div.button.source",getInitials(info.name));}
                var title=
                    ((kind===':CIRCLE')?("the reading circle "):
                     (kind===':OVERLAY')?("the reading guide "):
                     ("the layer "))+
                    ((info.name)?("“"+(info.name)+"”"):"")+
                    ((info.about)?": ":"")+
                    ((info.about)?(info.about):"");
                icon.title=title; icon.oid=info._id;
                if (info.name) icon.alt=getInitials(info.name);
                icon.id="SOURCEICON"+humid;
                fdjtDOM($ID("METABOOKSOURCES")," ",icon);}}
        return info;}
    metaBook.UI.addSource=addSource;
    metaBook.UI.addGlossSource=function(info){addSource(info,true);};

    function everyone_ontap(evt){
        evt=evt||window.event||null;
        var target=fdjtDOM.T(evt);
        // var sources=fdjtDOM.getParent(target,".metabooksources");
        // var glosses=fdjtDOM.getParent(target,".sbookglosses");
        var sources=$ID("METABOOKSOURCES");
        var glosses=$ID("METABOOKALLGLOSSES");
        if ((!(sources))||(!(glosses)))
            return; /* Warning? */
        if (fdjtDOM.hasClass(target,"selected")) {
            metaBook.setMode(false);
            fdjtDOM.cancel(evt);
            return;}
        var selected=fdjtDOM.$(".selected",sources);
        toggleClass(selected,"selected");
        addClass(target,"selected");
        metaBook.UI.selectSources(metaBook.slices.allglosses,false);
        fdjtDOM.cancel(evt);}
    metaBook.UI.handlers.everyone_ontap=everyone_ontap;

    function sources_tapped(evt){
        evt=evt||window.event||null;
        // if (!(metaBook.user)) return;
        var target=fdjtDOM.T(evt);
        // var sources=fdjtDOM.getParent(target,".metabooksources");
        // var glosses=fdjtDOM.getParent(target,".sbookglosses");
        var sources=$ID("METABOOKSOURCES");
        var glosses=$ID("METABOOKALLGLOSSES");
        var new_sources=[];
        if ((!(sources))||(!(glosses))||(!(target))||(!(target.oid)))
            return; /* Warning? */
        var selected=fdjtDOM.$(".selected",sources);
        toggleClass(target,"selected");
        if (!(evt.shiftKey)) dropClass(selected,"selected");
        selected=fdjtDOM.$(".selected",sources);
        var i=0, lim=selected.length; while (i<lim) {
            new_sources.push(selected[i++].oid);}
        var everyone=fdjtDOM.$(".everyone",sources)[0];
        if (new_sources.length) {
            if (everyone) dropClass(everyone,"selected");
            metaBook.UI.selectSources(metaBook.slices.allglosses,new_sources);}
        else {
            if (everyone) addClass(everyone,"selected");
            metaBook.UI.selectSources(metaBook.slices.allglosses,false);}
        fdjtDOM.cancel(evt);}

    function sources_taptap(evt){
        evt=evt||window.event||null;
        // if (!(metaBook.user)) return;
        var target=fdjtDOM.T(evt);
        // var sources=fdjtDOM.getParent(target,".metabooksources");
        // var glosses=fdjtDOM.getParent(target,".sbookglosses");
        var sources=$ID("METABOOKSOURCES");
        var glosses=$ID("METABOOKALLGLOSSES");
        var new_sources=[];
        if ((!(sources))||(!(glosses))||(!(target))||(!(target.oid)))
            return; /* Warning? */
        var selected=fdjtDOM.$(".selected",sources);
        toggleClass(target,"selected");
        selected=fdjtDOM.$(".selected",sources);
        var i=0, lim=selected.length; while (i<lim) {
            new_sources.push(selected[i++].oid);}
        var everyone=fdjtDOM.$(".everyone",sources)[0];
        if (new_sources.length) {
            if (everyone) dropClass(everyone,"selected");
            metaBook.UI.selectSources(metaBook.slices.allglosses,new_sources);}
        else {
            if (everyone) addClass(everyone,"selected");
            metaBook.UI.selectSources(metaBook.slices.allglosses,false);}
        fdjtDOM.cancel(evt);}

    function geticon(source){
        return ((source._pic)||(source.pic)||(source.fb_pic)||
                (source.twitter_pic)||(source.gplus_pic)||
                ((source.fbid)&&
                 ("https://graph.facebook.com/"+
                  source.fbid+"/picture?type=square")));}

    function extendGlossmark(glossmark,glosses,image){
        var sources=metaBook.sourcedb; var glossdb=metaBook.glossdb;
        if (!(image)) image=fdjtDOM.getChild(glossmark,".wedge");
        var images=image.getAttribute("data-images").split("|");
        if ((images.length===1)&&(images[0]==="")) images=[];
        var i=0; var lim=glosses.length;
        while (i<lim) {
            var glossid=glosses[i++];
            if (typeof glossid!=="string") glossid=glossid._id;
            if (!(glossid)) continue;
            var gloss=glossdb.ref(glossid);
            var cur=glossmark.glosses;
            var maker=((gloss.maker)&&(sources.ref(gloss.maker)));
            var maker_img=((maker)&&geticon(maker));
            if (maker_img) images.push(maker_img);
            if (cur) {
                if (cur.indexOf(glossid)<0) cur.push(glossid);}
            else glossmark.glosses=[glossid];
            var outlets=gloss.sources||[];
            if (typeof outlets === 'string') outlets=[outlets];
            var j=0, jlim=outlets.length; while (j<jlim) {
                var outlet=sources.ref(outlets[j++]);
                var outlet_img=geticon(outlet);
                if (outlet_img) images.push(outlet_img);}}
        image.setAttribute("data-images",images.join("|"));
        return glossmark;}
    
    metaBook.UI.addGlossmark=function(passage,gloss){
        var Glosses=metaBook.glossdb;
        var current_glossmark=fdjtDOM.getChild(passage,".glossmark");
        if ((current_glossmark)&&(current_glossmark.parentNode===passage)) {
            if (gloss) extendGlossmark(current_glossmark,[gloss]);
            return current_glossmark;}
        var imgsrc=(mbicon("sbwedge",64,64));
        var wedge=fdjtDOM.Image(imgsrc,"wedge","glosses");
        var glossmark=fdjtDOM("a.glossmark.fdjtskiptext",wedge);
        // Get all the glosses from the index
        var id=passage.getAttribute("data-baseid")||passage.id;
        var glosses=Glosses.find("frag",id);
        glossmark.title=
            ((glosses.length>1)?
             ("See "+glosses.length+" glosses on this passage"):
             ("See the gloss on this passage"));
        wedge.defaultsrc=imgsrc;
        wedge.setAttribute("data-images","");
        extendGlossmark(glossmark,glosses,wedge);
        metaBook.UI.addHandlers(glossmark,"glossmark");
        addClass(passage,"glossed");
        fdjtDOM.prepend(passage,glossmark);
        glossmark.name="METABOOK_GLOSSMARK_"+id;
        return glossmark;};
    
    var MetaBookSlice=metaBook.Slice;

    function showGlossmark(target,point) {
        var id=target.codexbaseid||target.id;
        if (!(id)) return;
        var dups=metaBook.getDups(id);
        var glossids=metaBook.glossdb.find('frag',id), glosses=[];
        var slicediv=fdjtDOM("div.metabookglosses.metabookslice");
        if ((!(glossids))||(!(glossids.length)))
            addClass(slicediv,"noglosses");
        if (metaBook.target) metaBook.clearHighlights(metaBook.target);
        var i=0, lim=glossids.length; while (i<lim) {
            var glossref=metaBook.glossdb.ref(glossids[i++]);
            glosses.push(glossref);}
        // metaBook.glossdb.load(glosses);
        i=0; while (i<lim) {
            var gloss=glosses[i++];
            if (gloss.excerpt) {
                var range=metaBook.findExcerpt(dups,gloss.excerpt,gloss.exoff);
                if (range) {
                    var starts=range.startContainer;
                    if (!(hasClass(starts,"mbhighlightexcerpt"))) {
                        fdjtUI.Highlight(range,"mbhighlightexcerpt");}}}}
        var slice=new MetaBookSlice(slicediv,glosses,sort_point_glosses);
        var hudwrapper=fdjtDOM("div.hudpanel#METABOOKPOINTGLOSSES",slicediv);
        metaBook.openglossmark=slice;
        if (point) {
            mB.setMode(false);
            hudwrapper.style.display='block';
            hudwrapper.style.opacity=0.0;
            if ($ID("METABOOKPOINTGLOSSES"))
                fdjtDOM.replace("METABOOKPOINTGLOSSES",hudwrapper);
            else mB.body.appendChild(hudwrapper);
            var geom=fdjtDOM.getGeometry(slicediv);
            var wgeom=fdjtDOM.getGeometry(hudwrapper);
            var pgeom=fdjtDOM.getGeometry(point);
            var tgeom=fdjtDOM.getGeometry(target);
            var w=fdjtDOM.viewWidth(), h=fdjtDOM.viewHeight();
            if (metaBook.fullwidth) {
                var wspec=(w-30)+"px";
                hudwrapper.style.left="10px";
                hudwrapper.style.width=
                    hudwrapper.style.maxWidth=
                    hudwrapper.style.minWidth=wspec;}
            else if (geom.width>w) {
                hudwrapper.style.maxWidth=(w-20)+"px";
                hudwrapper.style.minWidth=Math.floor(w/2)+"px";
                hudwrapper.style.left="10px";}
            else if ((geom.height>h/2)||(w<500)) {
                // If the slice is big, drop the width constraint
                if (w<500) {
                    hudwrapper.style.maxWidth=(w-20)+"px";
                    hudwrapper.style.minWidth=Math.floor(w/2)+"px";
                    hudwrapper.style.left="10px";}
                else hudwrapper.style.maxWidth=(w-100)+"px";}
            geom=fdjtDOM.getGeometry(slicediv);
            wgeom=fdjtDOM.getGeometry(hudwrapper);
            if ((!(metaBook.fullwidth))&&(geom.width>(w-50)))
                hudwrapper.style.left="10px";
            var wh=false;
            if ((geom.height+15)>h/2) wh=h/2;
            else wh=geom.height+10;
            if ((!(metaBook.fullwidth))&&(wh>50))
                hudwrapper.style.minHeight=wh+'px';
            slicediv.style.overflowX='hidden';
            slicediv.style.overflowY='auto';
            var above_point=pgeom.top-60, below_point=(h-60)-pgeom.bottom;
            var below_passage=(h-60)-tgeom.bottom;
            // If the glossmark is taller than the target, use the
            // glossmark bottom
            if (tgeom.bottom<pgeom.bottom) tgeom.bottom=pgeom.bottom+10;
            if (wh<above_point) 
                hudwrapper.style.top=(pgeom.top-(wh+15))+'px';
            else if (geom.height<below_passage) 
                hudwrapper.style.top=(tgeom.bottom+5)+'px';
            else if (geom.height<below_point) 
                hudwrapper.style.top=(pgeom.bottom+15)+'px';
            else {
                // Now, we're scrolling
                if (!(metaBook.fullwidth)) {
                    hudwrapper.style.right=(w-pgeom.left+10)+'px';
                    hudwrapper.style.left='50px';}
                if (pgeom.top-(h/4)<50) {
                    hudwrapper.style.top='50px';
                    hudwrapper.style.bottom='auto';
                    hudwrapper.style.height=(h/2)+'px';}
                else {
                    hudwrapper.style.top=(pgeom.top-h/4)+'px';
                    hudwrapper.style.bottom='auto';
                    hudwrapper.style.height=(h/2)+'px';}}
            // fdjtLog("geom=%j, pgeom=%j, wgeom=%j ph=%j",geom,pgeom,wgeom,fdjtDOM.viewHeight());
            if (metaBook.fullwidth) {}
            else if (fdjtDOM.viewWidth()<300)
                hudwrapper.style.minWidth=((fdjtDOM.viewWidth())-10)+"px";
            else {}
            hudwrapper.style.display='';
            hudwrapper.style.opacity='';}
        else fdjtDOM.replace("METABOOKPOINTGLOSSES",hudwrapper);
        if (point) {
            var cur=$ID("METABOOKOPENGLOSSMARK");
            if (cur) {
                if (metaBook.target)
                    metaBook.clearHighlights(metaBook.target);
                cur.id="";}
            point.id="METABOOKOPENGLOSSMARK";}
        metaBook.setTarget(target);
        slice.update();
        metaBook.setMode("openglossmark");}
    metaBook.showGlossmark=showGlossmark;

    function sort_point_glosses(g1,g2){
        if ((g1.location)&&(g2.location)) {
            if (g1.location>g2.location) return -1;
            else if (g1.location<g2.location) return 1;
            else return 0;}
        else if ((g1.exoff)&&(g2.exoff)) {
            if (g1.exoff>g2.exoff) return -1;
            else if (g1.exoff<g2.exoff) return 1;
            else return 0;}
        else if (g1.created>g2.created) return -1;
        else if (g1.created<g2.created) return 1;
        else return 0;}

    function clearGlossmark() {
        if (metaBook.mode==="openglossmark") metaBook.setMode(false,true);
        var slicediv=fdjtDOM("div.metabookglosses.metabookslice");
        var hudwrapper=fdjtDOM("div.hudpanel#METABOOKPOINTGLOSSES",slicediv);
        fdjtDOM.replace("METABOOKPOINTGLOSSES",hudwrapper);}
    metaBook.clearGlossmark=clearGlossmark;

    var cancel=fdjtUI.cancel;

    fdjt.DOM.defListeners(
        metaBook.UI.handlers.mouse,
        {"#METABOOKSOURCES": {
            tap: sources_tapped,taptap: sources_taptap},
         "#METABOOKSOURCES .button.everyone": {
             tap: function(evt){
                 evt=evt||window.event;
                 metaBook.UI.handlers.everyone_ontap(evt);
                 fdjt.UI.cancel(event);}}});

   fdjt.DOM.defListeners(
        metaBook.UI.handlers.touch,
       {"#METABOOKSOURCES": {
            tap: sources_tapped,taptap: sources_taptap},
        "#METABOOKSOURCES .button.everyone": {
            touchstart: cancel,
            touchend: function(evt){
                evt=evt||window.event;
                metaBook.UI.handlers.everyone_ontap(evt);
                fdjt.UI.cancel(event);}}});

})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
