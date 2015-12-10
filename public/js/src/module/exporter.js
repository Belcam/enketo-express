'use strict';

var JSZip = require( 'jszip' );
var store = require( './store' );
var Promise = require( 'lie' );
var utils = require( './utils' );
var saveAs = require( 'jszip/vendor/FileSaver' );

function recordsToZip( enketoId, formTitle ) {
    var folder;
    var folderName;
    var content;
    var folderTasks = [];
    var fileTasks = [];
    var meta = [];
    var name = formTitle || enketoId;
    var zip = new JSZip();

    return store.record.getAll( enketoId )
        .then( function( records ) {
            records.forEach( function( rec ) {
                // TODO: probably better to do this sequentially with reduce()
                // get the full record with all its files
                folderTasks.push( store.record.get( rec.instanceId )
                    .then( function( record ) {
                        var failedFiles = [];
                        var folderMeta;
                        folderName = name + '_' + _formatDate( record.created );
                        // create folder
                        folder = zip.folder( folderName );
                        // add XML file to folder
                        folder.file( folderName + '.xml', record.xml, {
                            date: new Date( record.updated )
                        } );
                        folderMeta = {
                            'folder': folderName,
                            'draft': record.draft,
                            'local name': record.name,
                            'instanceID': record.instanceId
                        };
                        // add media files to folder
                        record.files.forEach( function( file ) {
                            fileTasks.push( utils.blobToDataUri( file.item )
                                .then( function( dataUri ) {
                                    // It's unfortunate we have to do this conversion.
                                    // In the future JSZip will probably support Blobs directly.
                                    console.debug( 'adding dataUri', dataUri );
                                    folder.file( file.name, dataUri, {
                                        base64: true
                                    } );
                                } )
                                .catch( function( error ) {
                                    console.debug( 'caught error' );
                                    console.error( error );
                                    failedFiles.push( file.name );
                                } )
                            );
                        } );

                        return Promise.all( fileTasks )
                            .then( function() {
                                if ( failedFiles.length > 0 ) {
                                    folderMeta[ 'failed files' ] = failedFiles;
                                }
                                meta.push( folderMeta );
                            } );
                    } ) );
            } );

            return Promise.all( folderTasks )
                .then( function() {
                    zip.file( 'meta.json', JSON.stringify( meta, null, 4 ) );
                    content = zip.generate( {
                        type: 'blob'
                    } );
                    saveAs( content, 'backup' + '_' + name + '_' + _formatDate( new Date() ) + '.zip' );
                } );
        } );
}

function _formatDate( date ) {
    var d = new Date( date );

    if ( d.toString() === 'Invalid Date' ) {
        return 'unknown' + Math.floor( Math.random() * 10000 );
    }

    return d.getFullYear() + '-' + _pad( d.getMonth(), 2 ) + '-' + _pad( d.getDate(), 2 ) + '_' + _pad( d.getHours(), 2 ) + '-' + _pad( d.getMinutes(), 2 ) + '-' + _pad( d.getSeconds(), 2 );
}

function _pad( num, l ) {
    var j;
    var str = num.toString();
    var zeros = l - str.length;

    for ( j = 0; j < zeros; j++ ) {
        str = '0' + str;
    }

    return str;
}

module.exports = {
    recordsToZip: recordsToZip
};
