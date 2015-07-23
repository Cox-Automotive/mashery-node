/*jslint node: true */
'use strict';

var _      = require('underscore');
var async  = require('async');
var Client = require('node-rest-client').Client;

var options         = {},
    client          = null,
    accessToken     = null,
    tokenExpiresAt  = new Date();

function authenticate(callback) {
    var args = {
        'data': ['grant_type=password&username=', options.user, '&password=', options.pass, '&scope=', options.areaUuid].join(''),
        'headers':{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    client.post(options.host + options.tokenEndpoint, args, function(data, response){
        if(data && data.error){
            throw new Error(data.error + (data.error_description ? ': ' + data.error_description : ''));
        }
        else if(data && data.access_token){
            accessToken = data.access_token;
            tokenExpiresAt = new Date();
            tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + data.expires_in);
        }
        if(_.isFunction(callback)) callback();
    });
}

function isTokenExpired(){
    return (new Date() > tokenExpiresAt);
}

function getHeaders(){
    return {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
    };
}

function registerClientMethods(){
    var baseURL = options.host + options.resourceEndpoint;
    
    // Services: http://support.mashery.com/docs/read/mashery_api/30/resources/services
    client.registerMethod('fetchAllServices', baseURL + '/services', 'GET');
    client.registerMethod('fetchService', baseURL + '/services/${id}', 'GET');
    client.registerMethod('createService', baseURL + '/services', 'POST');
    client.registerMethod('updateService', baseURL + '/services/${id}', 'PUT');
    client.registerMethod('deleteService', baseURL + '/services/${id}', 'DELETE');

    // Service Endpoints: http://support.mashery.com/docs/read/mashery_api/30/resources/services/endpoints
    client.registerMethod('fetchAllServiceEndpoints', baseURL + '/services/${id}/endpoints', 'GET');
    client.registerMethod('fetchServiceEndpoint', baseURL + '/services/${serviceId}/endpoints/${id}', 'GET');
    client.registerMethod('createServiceEndpoint', baseURL + '/services/${serviceId}/endpoints', 'POST');
    client.registerMethod('updateServiceEndpoint', baseURL + '/services/${serviceId}/endpoints/${id}', 'PUT');
    client.registerMethod('deleteServiceEndpoint', baseURL + '/services/${serviceId}/endpoints/${id}', 'DELETE');

    // Endpoint Methods: http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans/services/endpoints/methods
    client.registerMethod('fetchAllEndpointMethods', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods', 'GET');
    client.registerMethod('fetchEndpointMethod', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${id}', 'GET');
    client.registerMethod('createEndpointMethod', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods', 'POST');
    client.registerMethod('updateEndpointMethod', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${id}', 'PUT');
    client.registerMethod('deleteEndpointMethod', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${id}', 'DELETE');    

    // Service Roles: http://support.mashery.com/docs/read/mashery_api/30/resources/services/roles
    client.registerMethod('fetchAllServiceRoles', baseURL + '/services/${id}/roles', 'GET');
    client.registerMethod('fetchServiceRole', baseURL + '/services/${serviceId}/roles/${id}', 'GET');
    client.registerMethod('createServiceRole', baseURL + '/services/${serviceId}/roles', 'POST');
    client.registerMethod('updateServiceRole', baseURL + '/services/${serviceId}/roles/${id}', 'PUT');
    client.registerMethod('deleteServiceRole', baseURL + '/services/${serviceId}/roles/${id}', 'DELETE');

    // Packages: http://support.mashery.com/docs/read/mashery_api/30/resources/packages
    client.registerMethod('fetchAllPackages', baseURL + '/packages', 'GET');
    client.registerMethod('fetchPackage', baseURL + '/packages/${id}', 'GET');
    client.registerMethod('createPackage', baseURL + '/packages', 'POST');
    client.registerMethod('updatePackage', baseURL + '/packages', 'PUT');
    client.registerMethod('deletePackage', baseURL + '/packages', 'DELETE');

    // Plans: http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans
    client.registerMethod('fetchAllPlans', baseURL + '/packages/${packageId}/plans', 'GET');
    client.registerMethod('fetchPlan', baseURL + '/packages/${packageId}/plans/${id}', 'GET');
    client.registerMethod('createPlan', baseURL + '/packages/${packageId}/plans', 'POST');

    // Plan Services: http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans/services
    client.registerMethod('fetchAllPlanServices', baseURL + '/packages/${packageId}/plans/${planId}/services', 'GET');
    client.registerMethod('createPlanService', baseURL + '/packages/${packageId}/plans/${planId}/services', 'POST');
    client.registerMethod('createPlanEndpoint', baseURL + '/packages/${packageId}/plans/${planId}/services/${serviceId}/endpoints', 'POST');
    client.registerMethod('createPlanMethod', baseURL + '/packages/${packageId}/plans/${planId}/services/${serviceId}/endpoints/${endpointId}/methods', 'POST');

    // Domains: http://support.mashery.com/docs/read/mashery_api/30/resources/domains
    client.registerMethod('fetchAllDomains', baseURL + '/domains', 'GET');
    client.registerMethod('fetchDomain', baseURL + '/domains/${id}', 'GET');
    client.registerMethod('createDomain', baseURL + '/domains', 'POST');

    // Public Domains: http://support.mashery.com/docs/read/mashery_api/30/resources/domains/public
    client.registerMethod('fetchPublicDomains', baseURL + '/domains/public', 'GET');

    // Public FQDN: http://support.mashery.com/docs/read/mashery_api/30/resources/domains/public/hostnames
    client.registerMethod('fetchPublicDomainFQDNs', baseURL + '/domains/public/hostnames', 'GET');

    // System Domains: http://support.mashery.com/docs/read/mashery_api/30/resources/domains/system
    client.registerMethod('fetchSystemDomains', baseURL + '/domains/system', 'GET');

    // Public FQDN: http://support.mashery.com/docs/read/mashery_api/30/resources/domains/system/hostnames
    client.registerMethod('fetchSystemDomainFQDNs', baseURL + '/domains/system/hostnames', 'GET');

    // Roles: http://support.mashery.com/docs/read/mashery_api/30/resources/roles
    client.registerMethod('fetchAllRoles', baseURL + '/roles', 'GET');

    // Wrap all of our registered Mashery methods so we can silently inject the authentication headers
    _.each(client.methods, function(method, methodName){
        client.methods[methodName] = _.wrap(method, function(originalMethod, args, callback){
            if(!args) args = {};
            if(!args.headers) args.headers = {};

            async.series([
                function(cb){
                    if(!accessToken || isTokenExpired()){
                        authenticate(cb);
                    }
                    else{
                        cb();
                    }
                },
                function(cb){
                    _.extend(args.headers, getHeaders());
                    originalMethod(args, callback);
                }
            ]);
        });
    });
}

var exports = module.exports = {};

exports.init = _.once(function(_options){
    options = _options;
    client = new Client({ 
        user: _options.key, 
        password: _options.secret 
    });
    
    registerClientMethods();

    client.getAccessToken = function(){ return accessToken; };

    return client;
});