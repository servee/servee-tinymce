function load_wysiwyg($par){
	$par.find('textarea:not(.no_wysiwyg)').tinymce({
		// Location of TinyMCE script
		script_url : '/site_media/static/tinymce/jscripts/tiny_mce/tiny_mce_src.js',

        // relative_urls are awful.  I want to never, ever see them.
        relative_urls : false,

		// General options
		valid_elements: '*[*]',
		theme : 'advanced',
		plugins: 'paste,media,autoresize',
		fix_list_elements : true,

		// Theme options, empty on purpose
		theme_advanced_buttons1 : '',
		theme_advanced_buttons2 : '',
		theme_advanced_buttons3 : '',

		//Paste Options
		paste_create_paragraphs : false,
		paste_create_linebreaks : false,
		paste_use_dialog : true,
		paste_auto_cleanup_on_paste : true,
		paste_convert_middot_lists : false,
		paste_convert_headers_to_strong : true,

		// Example content CSS (should be your site CSS)
		// This is a convention, if you need to override
		// wysiwyg.css location, you'll have to override this
		// entire file.. or symlink.
		content_css : "/site_media/static/css/wysiwyg.css",

		//Auto resize
		theme_advanced_resizing_min_width : 50,
		theme_advanced_resizing_min_height : 350,

		setup: function (ed) {
			ed.onPostRender.add(function(ed,evt){
				$(ed.getBody()).addClass(ed.id);
				$(ed.getBody()).css({'backgroundColor':'transparent'});
				$(ed.getWin()).focus(function(e) {
					$('#srv_wysiwyg_tools').addClass('out');
			    });
			    
			    $par.find("input, textarea").focus(function(e) {
					$('#srv_wysiwyg_tools, .srv_adminBox').removeClass('out');
			    });
                a = ed;
			});
		}
	});
}

function srv_wysiwyg_insert_html_at_cursor(h){
	tinyMCE.execCommand('mceInsertContent', false, h);
	return;
}
function srv_get_content(){
	return tinyMCE.activeEditor.getContent({format:'raw'});
}
function srv_set_content(h){
	tinyMCE.activeEditor.setContent(h,{format:'raw'});
	return
}

function srv_put_link(){
	var inst = tinyMCE.activeEditor;
	var elm, elementArray, i;

	elm = inst.selection.getNode();
	elm = inst.dom.getParent(elm, "A");

	// Remove element if there is no href
	if (($("#srv_link_url").val() == '' )|| ($('#srv_link_url').val() == 'http://')) {
		tinyMCE.execCommand("mceBeginUndoLevel");
		i = inst.selection.getBookmark();
		inst.dom.remove(elm, 1);
		inst.selection.moveToBookmark(i);
		tinyMCE.execCommand("mceEndUndoLevel");
		alert('You must put a link in the box');
		return false;
	}
	
	if(tinyMCE.activeEditor.selection.isCollapsed())
	{
		if($("#srv_link_title").val().length > 0)
		{
			inst.selection.setContent('<span class="servee-auto-place">'+$("#srv_link_title").val()+'</span>');			
		}
		else
		{		
			inst.selection.setContent('<span class="servee-auto-place">'+$("#srv_link_url").val())+'</span>';
		}
		elementArray = tinymce.grep(inst.dom.select("span"), function(n) {return inst.dom.getAttrib(n, 'class') == 'servee-auto-place';});
		inst.dom.removeClass(elementArray,'servee-auto-place');
		inst.selection.select(elementArray[0]);
	}

	tinyMCE.execCommand("mceBeginUndoLevel");

	// Create new anchor elements
	if (elm == null) {
		tinyMCE.execCommand("CreateLink", false, "#mce_temp_url#", {skip_undo : 1});

		elementArray = tinymce.grep(inst.dom.select("a"), function(n) {return inst.dom.getAttrib(n, 'href') == '#mce_temp_url#';});
		for (i=0; i<elementArray.length; i++)
			srv_setAllAttribs(elm = elementArray[i]);
	} else
		srv_setAllAttribs(elm);

	tinyMCE.execCommand("mceEndUndoLevel");
	return false;
}
function srv_setAllAttribs(elm)
{
	var inst = tinyMCE.activeEditor;
	inst.dom.setAttrib(elm, 'href', $("#srv_link_url").val())
	if($("#srv_link_title").val().length > 0)
	{
		inst.dom.setAttrib(elm, 'title', $("#srv_link_title").val());
	}
	if($("#srv_link_new_window:checked").length == 1)
	{
		inst.dom.setAttrib(elm, 'target', '_blank');
	}
}
            
$("a.srv_bold").click(function(e){
	tinyMCE.activeEditor.execCommand("Bold");
	e.preventDefault();
	return false;
});
$("a.srv_italic").click(function(e){
	tinyMCE.activeEditor.execCommand("Italic");
	e.preventDefault();
	return false;
});
$("a.srv_underline").click(function(e){
	tinyMCE.activeEditor.execCommand("underline");
	e.preventDefault();
	return false;
});
$("a.srv_blockquote").click(function(e){
	tinyMCE.activeEditor.execCommand("formatblock",false,"blockquote");;
	e.preventDefault();
	return false;
});
$("a.srv_bullet").click(function(e){
	tinyMCE.activeEditor.execCommand("insertunorderedlist");;
	e.preventDefault();
	return false;
});
$("a.srv_number").click(function(e){
	tinyMCE.activeEditor.execCommand("insertorderedlist");;
	e.preventDefault();
	return false;
});
$("a.srv_unlink").click(function(e){
	tinyMCE.activeEditor.execCommand("unlink");
	e.preventDefault();
	return false;
});
$("a.srv_undo").click(function(e){
	tinyMCE.activeEditor.execCommand("undo");
	e.preventDefault();
	return false;
});
$("a.srv_redo").click(function(e){
	tinyMCE.activeEditor.execCommand("redo");
	e.preventDefault();
	return false;
});
$("a.srv_hr").click(function(e){
	tinyMCE.activeEditor.execCommand("inserthorizontalrule");;
	e.preventDefault();
	return false;
});
$("a.srv_word").click(function(e){
	pasteWord()
	e.preventDefault();
	return false;
});
$("a.srv_spell").click(function(e){
	tinyMCE.activeEditor.execCommand("mceWritingImprovementTool");
	e.preventDefault();
	return false;
});
$('a.f-block').click(function(e){
	var p = $(this).parent()[0].nodeName.toLowerCase();
	tinyMCE.activeEditor.execCommand('formatblock',false,p);
	e.preventDefault();
	return true;
});