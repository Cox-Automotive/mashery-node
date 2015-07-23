/*jslint node: true */
'use strict';

require('dotenv').load({silent: true});

var mashery = require('../lib/mashery');
var assert = require('chai').assert;

describe('mashery-api-client', function(){
    var apiClient;

    before(function(){
        console.log('setup');
        apiClient = mashery.init({
            // host: config.mashery.apihost,
            // tokenEndpoint: config.mashery.endpoints.token,
            // resourceEndpoint: config.mashery.endpoints.resource,
            // user: process.env.MASHERY_UN,
            // pass: process.env.MASHERY_PW,
            // key: process.env.MASHERY_API_KEY,
            // secret: process.env.MASHERY_SECRET,
            // areaUuid: process.env.MASHERY_AREA_UUID
        });

    });

    it('should generate an api client instance', function(done){
        // var api = utils.getApiClient();
        // assert.isNotNull(api);
        done();
    });

    it('should generate an access token when invoking a method', function(done){
        // var api = utils.getApiClient();
        // api.methods.fetchAllServices({}, function(serviceData, serviceRawResponse){
            // assert.isNotNull(api.getAccessToken());
            done();            
        // });
    });

    it('should return data from mashery when authenticated', function(done){
        // var api = utils.getApiClient();
        // api.methods.fetchAllServices({}, function(serviceData, serviceRawResponse){
        //     assert.isNotNumber(serviceData.errorCode);
        //     assert.isArray(serviceData);
        //     assert.isAbove(serviceData.length, 0);
        //     assert.isString(serviceData[0].id);
        //     assert.isUndefined(serviceRawResponse.headers['x-mashery-error-code']);
            done();
        // });
    });
});