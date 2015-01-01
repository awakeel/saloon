/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'language/models/language'], function (Backbone, ModelLanguage) {
	'use strict';
	return Backbone.Collection.extend({
           urlRoot: '/api/language',
           
            model:ModelLanguage,
            url: function () {
                return 'api/language';
            },
           
             
	});
});