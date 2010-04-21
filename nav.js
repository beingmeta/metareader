/* -*- Mode: Javascript; -*- */

var sbooks_nav_id="$Id$";
var sbooks_nav_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
    large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knowlets, visit www.knowlets.net
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

/* New NAV hud design
   One big DIV for the whole TOC, use CSS to change what's visible
   General structure:
     div.sbooktoc.toc0
       div.head (contains section name)
       div.spanbar (contains spanbar)
       div.sub (contains all the subsections names)
       div.sbooktoc.toc1 (tree for first section)
       div.sbooktoc.toc1 (tree for second section)
    Controlling display:
       .cur class on current head
       .live class on div.sbooktoc and parents

     
*/

/* Creating the HUD */

function sbookCreateNavHUD(eltspec)
{
  var root_info=sbook_getinfo(sbook_root);
  var toc_div=sbookTOCDiv(root_info,0,false,"SBOOKTOC4");
  var div=fdjtDiv(eltspec||"#SBOOKTOC.hudblock.hud",toc_div);
  if (!(eltspec)) sbookNavHUD=div;
  if (sbook_interaction==="mouse") {
    div.addEventListener("mouseover",sbookTOC_onmouseover,false);
    div.addEventListener("mouseout",sbookTOC_onmouseout,false);
    div.addEventListener("mousedown",sbookTOC_onmousedown,false);
    div.addEventListener("mouseup",sbookTOC_onmouseup,false);
    div.addEventListener("click",sbookTOC_onclick,false);}
  else div.addEventListener("click",sbookTOC_oneclick,false);
  return div;
}

function sbookStaticNavHUD(eltspec)
{
  var root_info=sbook_getinfo(sbook_root);
  var toc_div=sbookTOCDiv(root_info,0,false,"SBOOKDASHTOC4");
  var div=fdjtDiv(eltspec||"#SBOOKDASHTOC",toc_div);
  if (!(eltspec)) sbookNavHUD=div;
  if (sbook_interaction==="mouse") {
    div.addEventListener("mouseover",sbookTOC_onmouseover,false);
    div.addEventListener("mouseout",sbookTOC_onmouseout,false);
    div.addEventListener("mousedown",sbookTOC_onmousedown,false);
    div.addEventListener("mouseup",sbookTOC_onmouseup,false);
    div.addEventListener("click",sbookStaticTOC_onclick,false);}
  else div.addEventListener("click",sbookTOC_oneclick,false);
  return div;
}

/* Building the DIV */

function sbookTOCDiv(headinfo,depth,classname,prefix)
{
  var progressbar=
    fdjtImage('http://static.beingmeta.com/graphics/silverbrick.png',
	      'progressbar');
  var progressbar=fdjtNewElt("HR.progressbar");
  var head=fdjtNewElt("A.sectname",headinfo.title);
  var toc=fdjtDiv(classname||"sbooktoc",
		  fdjtDiv("head",progressbar,head),
		  _sbook_generate_spanbar(headinfo),
		  sbookTOCDivSubsections(headinfo));
  var sub=headinfo.sub;
  if (!(depth)) depth=0;
  head.name="SBR"+headinfo.id;
  head.sbook_ref=headinfo.id;
  toc.sbook_start=headinfo.starts_at;
  toc.sbook_end=headinfo.ends_at;
  fdjtAddClass(toc,"toc"+depth);
  toc.id=(prefix||"SBOOKTOC4")+headinfo.id;
  if ((!(sub)) || (!(sub.length))) {
    fdjtAddClass(toc,"sbooktocleaf");
    return toc;}
  var i=0; var n=sub.length;
  while (i<n)
    fdjtAppend(toc,sbookTOCDiv(sub[i++],depth+1,classname,prefix));
  return toc;
}

function sbookTOCDivSubsections(headinfo)
{
  var sub=headinfo.sub;
  if ((!(sub)) || (!(sub.length))) return false;
  var div=fdjtDiv("sub");
  var i=0; var n=sub.length;
  while (i<n) {
    var subinfo=sub[i];
    var subspan=fdjtNewElt("A.sectname",subinfo.title);
    subspan.sbook_ref=subinfo.id;
    subspan.name="SBR"+subinfo.id;
    fdjtAppend(div,((i>0)&&" \u00b7 "),subspan);
    i++;}
  return div;
}

/* Updating the HUD */

function _sbook_generate_spanbar(headinfo)
{
  var spanbar=fdjtDiv("spanbar");
  var spans=fdjtDiv("spans");
  var start=headinfo.starts_at;
  var end=headinfo.ends_at;
  var len=end-start;
  var subsections=headinfo.sub; var last_info;
  var sectnum=0; var percent=0;
  spanbar.starts=start; spanbar.ends=end;
  if ((!(subsections)) || (subsections.length===0))
    return false;
  var progress=fdjtDiv("progressbox","\u00A0");
  var range=false; // fdjtDiv("rangebox","\u00A0");
  fdjtAppend(spanbar,spans);
  fdjtAppend(spans,range,progress);
  progress.style.left="0%";
  if (range) range.style.left="0%";
  var i=0; while (i<subsections.length) {
    var spaninfo=subsections[i++];
    var subsection=document.getElementById(spaninfo.id);
    var spanstart; var spanend; var spanlen; var addname=true;
    if ((sectnum===0) && ((spaninfo.starts_at-start)>0)) {
      /* Add 'fake section' for the precursor of the first actual section */
      spanstart=start;  spanend=spaninfo.starts_at;
      spaninfo=headinfo; subsection=document.getElementById(headinfo.id);
      i--; sectnum++; addname=false;}
    else {
      spanstart=spaninfo.starts_at; spanend=spaninfo.ends_at;
      sectnum++;}
    var span=_sbook_generate_span
      (sectnum,subsection,spaninfo.title,spanstart,spanend,len,
       ((addname)&&("SBR"+subsection.id)));
    fdjtAppend(spans,span);
    last_info=spaninfo;}
  if ((end-last_info.ends_at)>0) {
    /* Add 'fake section' for the content after the last actual section */
    var span=_sbook_generate_span
      (sectnum,head,headinfo.title,last_info.ends_at,end,len);
    fdjtAppend(spanbar,span);}    
  return spanbar;
}

function _sbook_generate_span(sectnum,subsection,title,spanstart,spanend,len,name)
{
  var spanlen=spanend-spanstart;
  var anchor=fdjtNewElt("A.brick","\u00A0");
  var span=fdjtDiv("sbookhudspan",anchor);
  var width=(Math.floor(10000*(spanlen/len))/100)+"%";
  var odd=((sectnum%2)==1);
  if (odd) span.setAttribute("odd",sectnum);
  else span.setAttribute("even",sectnum);
  span.style.width=width;
  span.title=(title||"section")+" ("+spanstart+"+"+(spanend-spanstart)+")";
  span.sbook_ref=subsection.id;
  if (name) anchor.name=name;
  return span;
}

/* TOC display update */

function sbookTOCUpdate(head,prefix)
{
  if (!(prefix)) prefix="SBOOKTOC4";
  if (sbook_head) {
    // Hide the current head and its (TOC) parents
    var tohide=[];
    var info=sbook_getinfo(sbook_head);
    var base_elt=document.getElementById(prefix+info.id);
    while (info) {
      var tocelt=document.getElementById(prefix+info.id);
      tohide.push(tocelt);
      // Get TOC parent
      info=info.sbook_head;
      tocelt=document.getElementById(prefix+info.id);}
    var n=tohide.length-1;
    // Go backwards (up) to potentially accomodate some redisplayers
    while (n>=0) fdjtDropClass(tohide[n--],"live");
    fdjtDropClass(base_elt,"cur");}
  if (!(head)) return;
  var info=sbook_getinfo(head);
  var base_elt=document.getElementById(prefix+info.id);
  var toshow=[];
  while (info) {
    var tocelt=document.getElementById(prefix+info.id);
    toshow.push(tocelt);
    info=info.sbook_head;}
  var n=toshow.length-1;
  // Go backwards to accomodate some redisplayers
  while (n>=0) {
    fdjtAddClass(toshow[n--],"live");}
  fdjtAddClass(base_elt,"cur");
}

/* TOC handlers */

function sbookTOC_onmouseover(evt)
{
  evt=evt||event;
  var target=$T(evt);
  fdjtCoHi_onmouseover(evt);
  if (fdjtIsClickactive(target)) return;
  if (!(($P(".spanbar",target))||($P(".previewicon",target)))) {
    if (sbook_preview) sbookSetPreview(false);
    return;}
  var ref=sbookGetRef(target);
  if (sbook_preview) {
    if (ref===sbook_preview) {}
    else if (ref) sbookSetPreview(ref);
    else sbookSetPreview(false);
    fdjtCancelEvent(evt);}
  else if (ref) {
    sbookSetPreview(ref);
    fdjtCancelEvent(evt);}
  else {
    sbookSetPreview(false);
    fdjtCancelEvent(evt);}
}

function sbookTOC_onmouseout(evt)
{
  evt=evt||event;
  var target=$T(evt);
  fdjtCoHi_onmouseout(evt);
  var ref=sbookGetRef(target);
  if (ref) sbookSetPreview(false);
}

function sbookTOC_onmousedown(evt)
{
  evt=evt||event;
  sbook_mousedown=fdjtTime();
  var target=$T(evt);
  fdjtCoHi_onmouseout(evt);
  if (!(($P(".sectname",target))||
	($P(".sbooksummaries",target))))
    return;
  var ref=sbookGetRef(target);
  if (ref) sbookSetPreview(ref);
}

function sbookTOC_onmouseup(evt)
{
  evt=evt||event;
  if ((sbook_preview)||(sbook_preview_target))
    sbookSetPreview(false);
  fdjtCancelEvent(evt);
}

function sbookTOC_onclick(evt)
{
  evt=evt||event;
  if ((sbook_mousedown)&&
      ((fdjtTime()-sbook_mousedown)>sbook_hold_threshold)) {
    sbook_mousedown=false;
    fdjtCancelEvent(evt);
    return false;}
  var target=$T(evt);
  var ref=sbookGetRef(target);
  if (!(ref)) return;
  sbookGoTo(ref);
  var info=sbook_getinfo(ref);
  if ((info.sub)&&(info.sub.length>1)) sbookHUDMode("toc");
  else sbookHUDMode(false);
  fdjtCancelEvent(evt);
}

function sbookTOC_oneclick(evt)
{
  evt=evt||event;
  if (sbook_preview) return;
  var target=$T(evt);
  var ref=sbookGetRef(target);
  if (sbook_preview===ref) sbookPreview(false);
  else if (ref) sbookPreview(ref);
  else if (sbook_preview) sbookPreview(false);
  else {}
  fdjtCancelEvent(evt);
}

function sbookStaticTOC_onclick(evt)
{
  evt=evt||event;
  if ((sbook_mousedown)&&
      ((fdjtTime()-sbook_mousedown)>sbook_hold_threshold)) {
    sbook_mousedown=false;
    fdjtCancelEvent(evt);
    return false;}
  var target=$T(evt);
  var ref=sbookGetRef(target);
  if (!(ref)) return;
  sbookGoTo(ref);
  sbookPreview(false);
  sbookHUDMode(false);
  fdjtCancelEvent(evt);
}

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "cd ..; make" ***
;;;  End: ***
*/
