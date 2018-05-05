/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	config.language = 'ko';
	
	// config.uiColor = '#AADC6E';

	/* 심플한 에디터 형식. */
	// config.toolbar = [
	//     { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
	//     { name: 'styles', items: [ 'Styles', 'Format' ] },
	//     { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
	//     { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
	//     { name: 'links', items: [ 'Link', 'Unlink' ] },
	//     { name: 'insert', items: [ 'Image', 'Table' ] },
	//     { name: 'tools', items: [ 'Maximize' ] }
	// ];

	config.removeButtons = 'Save,EasyImageUpload,Flash';
};
