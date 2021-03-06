'use strict';

var Promise = require( 'lie' );
var config = require( './config-model' ).server;
var TError = require( '../lib/custom-error' ).TranslatedError;
var client = require( 'redis' ).createClient( config.redis.main.port, config.redis.main.host, {
    auth_pass: config.redis.main.password
} );
var path = require( 'path' );
var debug = require( 'debug' )( 'submission-model' );
var logger;

/**
 * Use a cron job and logrotate service, e.g.:
 * /usr/sbin/logrotate /home/enketo/logrotate.conf -s /home/enketo/enketo-express/logs/logrotate
 * 
 * Example analyses of log files for form with enketo ID "YYYd":
 *
 * zgrep --no-filename "      YYYd    " submissions*.* | sort > YYYd-submissions.log 
 * (you may need to enter CTRL-V to enter the literal TAB character), 
 * 
 * or (might be slower):
 * zgrep --no-filename -P "\tYYYd\t" submissions*.* > YYYp-submissions.log
 */

// only instantiate logger if required
if ( config.log.submissions ) {
    logger = require( 'bristol' );
    logger.addTarget( 'file', {
            file: path.resolve( __dirname, '../../logs/submissions.log' )
        } )
        .withFormatter( _formatter );
}

// in test environment, switch to different db
if ( process.env.NODE_ENV === 'test' ) {
    client.select( 15 );
}


/**
 * Whether instanceID was submitted successfully before.
 *
 * To prevent large submissions that were divided into multiple batches from recording multiple times,
 * we use a redis capped list to store the latest 100 instanceIDs
 * This list can be queried to avoid double-counting instanceIDs
 *
 * Note that edited records are submitted multiple times with different instanceIDs.
 *
 * @param  {[type]}  id         [description]
 * @param  {[type]}  instanceId [description]
 * @return {Boolean}            [description]
 */
function isNew( id, instanceId ) {
    var key;
    var error;

    if ( !id || !instanceId ) {
        error = new Error( 'Cannot log instanceID: either enketo ID or instance ID not provided', id, instanceId );
        error.status = 400;
        return Promise.reject( error );
    }

    key = 'su:' + id.trim();

    return _getLatestSubmissionIds( key )
        .then( function( latest ) {
            return _alreadyRecorded( instanceId, latest );
        } )
        .then( function( alreadyRecorded ) {
            if ( !alreadyRecorded ) {
                client.lpush( key, instanceId, function( error, res ) {
                    if ( error ) {
                        console.error( 'Error pushing instanceID into: ' + key );
                    } else {
                        // only store last 100 IDs
                        client.ltrim( key, 0, 99, function( error, res ) {
                            if ( error ) {
                                console.error( 'Error trimming: ' + key );
                            }
                        } );
                    }
                } );
                return true;
            }
            return false;
        } );
}

function add( id, instanceId, deprecatedId ) {
    if ( logger ) {
        logger.info( instanceId, {
            enketoId: id,
            deprecatedId: deprecatedId
        } );
    }
}

function _alreadyRecorded( instanceId, list ) {
    list = list || [];
    return list.indexOf( instanceId ) !== -1;
}

function _getLatestSubmissionIds( key ) {
    return new Promise( function( resolve, reject ) {
        client.lrange( key, 0, -1, function( error, res ) {
            if ( error ) {
                reject( error );
            } else {
                resolve( res );
            }
        } );
    } );
}

function _formatter( options, severity, date, elems ) {
    var instanceId = '-';
    var enketoId = '-';
    var deprecatedId = '-';

    if ( Array.isArray( elems ) ) {
        instanceId = elems[ 0 ];
        if ( elems[ 1 ] && typeof elems[ 1 ] === 'object' ) {
            enketoId = elems[ 1 ].enketoId || enketoId;
            deprecatedId = elems[ 1 ].deprecatedId || deprecatedId;
        }
    }

    return [ date.toISOString(), enketoId, instanceId, deprecatedId ].join( '\t' );
}

module.exports = {
    isNew: isNew,
    add: add
};
