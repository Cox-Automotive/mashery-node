/*jslint node: true */
'use strict';

var _      = require('underscore');
var async  = require('async');
var Client = require('node-rest-client').Client;

var options         = { host: 'https://api.mashery.com', tokenEndpoint: '/v3/token', resourceEndpoint: '/v3/rest' },
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

function wrapMethods(){
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
                    cb();
                }
            ], function(){
                originalMethod(args, callback);
            });
        });
    });
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

    // Response Filters: http://support.mashery.com/docs/read/mashery_api/30/resources/services/endpoints/methods/responsefilters
    client.registerMethod('fetchAllResponseFilters', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${methodId}/responseFilters', 'GET');
    client.registerMethod('fetchResponseFilter', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${methodId}/responseFilters/${id}', 'GET');
    client.registerMethod('createResponseFilter', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${methodId}/responseFilters', 'POST');
    client.registerMethod('updateResponseFilter', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${methodId}/responseFilters/${id}', 'PUT');
    client.registerMethod('deleteResponseFilter', baseURL + '/services/${serviceId}/endpoints/${endpointId}/methods/${methodId}/responseFilters/${id}', 'DELETE');    

    // Scheduled Maintenance Events: http://support.mashery.com/docs/read/mashery_api/30/resources/services/endpoints/scheduledmaintenanceevent
    client.registerMethod('fetchScheduledEvent', baseURL + '/services/${serviceId}/endpoints/${endpointId}/scheduledMaintenanceEvent', 'GET');
    client.registerMethod('createScheduledEvent', baseURL + '/services/${serviceId}/endpoints/${endpointId}/scheduledMaintenanceEvent', 'POST');
    client.registerMethod('updateScheduledEvent', baseURL + '/services/${serviceId}/endpoints/${endpointId}/scheduledMaintenanceEvent', 'PUT');
    client.registerMethod('deleteScheduledEvent', baseURL + '/services/${serviceId}/endpoints/${endpointId}/scheduledMaintenanceEvent', 'DELETE');    

    // Endpoint Cache: http://support.mashery.com/docs/read/mashery_api/30/resources/services/endpoints/cache
    client.registerMethod('fetchEndpointCache', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cache', 'GET');
    client.registerMethod('createEndpointCache', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cache', 'POST');
    client.registerMethod('updateEndpointCache', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cache', 'PUT');
    client.registerMethod('deleteEndpointCache', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cache', 'DELETE');    

    // CORS: http://support.mashery.com/docs/read/mashery_api/30/resources/services/endpoints/cors
    client.registerMethod('fetchCORS', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cors', 'GET');
    client.registerMethod('createCORS', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cors', 'POST');
    client.registerMethod('updateCORS', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cors', 'PUT');
    client.registerMethod('deleteCORS', baseURL + '/services/${serviceId}/endpoints/${endpointId}/cors', 'DELETE');    

    // System Domain Auth: http://support.mashery.com/docs/read/mashery_api/30/resources/services/endpoints/systemdomainauthentication
    client.registerMethod('fetchSysAuth', baseURL + '/services/${serviceId}/endpoints/${endpointId}/systemDomainAuthentication', 'GET');
    client.registerMethod('createSysAuth', baseURL + '/services/${serviceId}/endpoints/${endpointId}/systemDomainAuthentication', 'POST');
    client.registerMethod('updateSysAuth', baseURL + '/services/${serviceId}/endpoints/${endpointId}/systemDomainAuthentication', 'PUT');
    client.registerMethod('deleteSysAuth', baseURL + '/services/${serviceId}/endpoints/${endpointId}/systemDomainAuthentication', 'DELETE');    

    // Security Profile: http://support.mashery.com/docs/read/mashery_api/30/resources/services/securityprofile
    client.registerMethod('fetchSecurityProfile', baseURL + '/services/${serviceId}/securityProfile', 'GET');
    client.registerMethod('createSecurityProfile', baseURL + '/services/${serviceId}/securityProfile', 'POST');
    client.registerMethod('updateSecurityProfile', baseURL + '/services/${serviceId}/securityProfile', 'PUT');
    client.registerMethod('deleteSecurityProfile', baseURL + '/services/${serviceId}/securityProfile', 'DELETE');

    // Security Profile - OAuth: http://support.mashery.com/docs/read/mashery_api/30/resources/services/securityprofile/oauth
    client.registerMethod('fetchSecurityProfileOAuth', baseURL + '/services/${serviceId}/securityProfile/oauth', 'GET');
    client.registerMethod('createSecurityProfileOAuth', baseURL + '/services/${serviceId}/securityProfile/oauth', 'POST');
    client.registerMethod('updateSecurityProfileOAuth', baseURL + '/services/${serviceId}/securityProfile/oauth', 'PUT');
    client.registerMethod('deleteSecurityProfileOAuth', baseURL + '/services/${serviceId}/securityProfile/oauth', 'DELETE');

    // Service Cache: http://support.mashery.com/docs/read/mashery_api/30/resources/services/cache
    client.registerMethod('fetchServiceCache', baseURL + '/services/${serviceId}/cache', 'GET');
    client.registerMethod('createServiceCache', baseURL + '/services/${serviceId}/cache', 'POST');
    client.registerMethod('updateServiceCache', baseURL + '/services/${serviceId}/cache', 'PUT');
    client.registerMethod('deleteServiceCache', baseURL + '/services/${serviceId}/cache', 'DELETE');

    // Service Roles: http://support.mashery.com/docs/read/mashery_api/30/resources/services/roles
    client.registerMethod('fetchAllServiceRoles', baseURL + '/services/${id}/roles', 'GET');
    client.registerMethod('fetchServiceRole', baseURL + '/services/${serviceId}/roles/${id}', 'GET');
    client.registerMethod('createServiceRole', baseURL + '/services/${serviceId}/roles', 'POST');
    client.registerMethod('updateServiceRole', baseURL + '/services/${serviceId}/roles/${id}', 'PUT');
    client.registerMethod('deleteServiceRole', baseURL + '/services/${serviceId}/roles/${id}', 'DELETE');

    // Error Sets: http://support.mashery.com/docs/read/mashery_api/30/resources/services/errorsets
    client.registerMethod('fetchAllServiceErrorSets', baseURL + '/services/${id}/errorSets', 'GET');
    client.registerMethod('fetchServiceErrorSet', baseURL + '/services/${serviceId}/errorSets/${id}', 'GET');
    client.registerMethod('createServiceErrorSet', baseURL + '/services/${serviceId}/errorSets', 'POST');
    client.registerMethod('updateServiceErrorSet', baseURL + '/services/${serviceId}/errorSets/${id}', 'PUT');
    client.registerMethod('deleteServiceErrorSet', baseURL + '/services/${serviceId}/errorSets/${id}', 'DELETE');

    // Error Messages: http://support.mashery.com/docs/read/mashery_api/30/resources/services/errorsets/errormessages
    client.registerMethod('fetchAllErrorMessages', baseURL + '/services/${serviceId}/errorSets/${errorSetId}/errorMessages', 'GET');
    client.registerMethod('fetchErrorMessage', baseURL + '/services/${serviceId}/errorSets/${errorSetId}/errorMessages/${id}', 'GET');
    client.registerMethod('createErrorMessage', baseURL + '/services/${serviceId}/errorSets/${errorSetId}/errorMessages', 'POST');
    client.registerMethod('updateErrorMessage', baseURL + '/services/${serviceId}/errorSets/${errorSetId}/errorMessages/${id}', 'PUT');
    client.registerMethod('deleteErrorMessage', baseURL + '/services/${serviceId}/errorSets/${errorSetId}/errorMessages/${id}', 'DELETE');

    // Packages: http://support.mashery.com/docs/read/mashery_api/30/resources/packages
    client.registerMethod('fetchAllPackages', baseURL + '/packages', 'GET');
    client.registerMethod('fetchPackage', baseURL + '/packages/${id}', 'GET');
    client.registerMethod('createPackage', baseURL + '/packages', 'POST');
    client.registerMethod('updatePackage', baseURL + '/packages/${id}', 'PUT');
    client.registerMethod('deletePackage', baseURL + '/packages/${id}', 'DELETE');

    // Package Keys: http://support.mashery.com/docs/read/mashery_api/30/resources/packagekeys
    client.registerMethod('fetchAllPackageKeys', baseURL + '/packageKeys', 'GET');
    client.registerMethod('fetchPackageKey', baseURL + '/packageKeys/${id}', 'GET');
    client.registerMethod('updatePackageKey', baseURL + '/packageKeys/${id}', 'PUT');
    client.registerMethod('deletePackageKey', baseURL + '/packageKeys/${id}', 'DELETE');

    // Plans: http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans
    client.registerMethod('fetchAllPlans', baseURL + '/packages/${packageId}/plans', 'GET');
    client.registerMethod('fetchPlan', baseURL + '/packages/${packageId}/plans/${id}', 'GET');
    client.registerMethod('createPlan', baseURL + '/packages/${packageId}/plans', 'POST');

    // Plan Services: http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans/services
    client.registerMethod('fetchAllPlanServices', baseURL + '/packages/${packageId}/plans/${planId}/services', 'GET');
    client.registerMethod('fetchAllPlanServicesForService', baseURL + '/packages/${packageId}/plans/${planId}/services/${id}', 'GET');
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

    // Roles: http://support.mashery.com/docs/read/mashery_api/30/resources/roles
    client.registerMethod('fetchAllRoles', baseURL + '/roles', 'GET');

    // Scheduled Maintenance Events: http://support.mashery.com/docs/read/mashery_api/30/resources/scheduledmaintenanceevents
    client.registerMethod('fetchAllScheduledMaintenance', baseURL + '/scheduledMaintenanceEvents', 'GET');
    client.registerMethod('fetchScheduledMaintenance', baseURL + '/scheduledMaintenanceEvents/${id}', 'GET');
    client.registerMethod('createScheduledMaintenance', baseURL + '/scheduledMaintenanceEvents', 'POST');
    client.registerMethod('updateScheduledMaintenance', baseURL + '/scheduledMaintenanceEvents/${id}', 'PUT');
    client.registerMethod('deleteScheduledMaintenance', baseURL + '/scheduledMaintenanceEvents/${id}', 'DELETE');

    // Scheduled Maintenance Event Endpoints: http://support.mashery.com/docs/read/mashery_api/30/resources/scheduledmaintenanceevents/endpoints
    client.registerMethod('fetchAllScheduledMaintenanceEndpoints', baseURL + '/scheduledMaintenanceEvents/${maintenanceId}/endpoints', 'GET');
    client.registerMethod('fetchScheduledMaintenanceEndpoint', baseURL + '/scheduledMaintenanceEvents/${maintenanceId}/endpoints/${id}', 'GET');
    client.registerMethod('createScheduledMaintenanceEndpoint', baseURL + '/scheduledMaintenanceEvents/${maintenanceId}/endpoints', 'POST');
    client.registerMethod('updateScheduledMaintenanceEndpoint', baseURL + '/scheduledMaintenanceEvents/${maintenanceId}/endpoints/${id}', 'PUT');
    client.registerMethod('deleteScheduledMaintenanceEndpoint', baseURL + '/scheduledMaintenanceEvents/${maintenanceId}/endpoints/${id}', 'DELETE');

    // Email Sets: http://support.mashery.com/docs/read/mashery_api/30/resources/emailtemplatesets
    client.registerMethod('fetchAllEmailTemplateSets', baseURL + '/emailTemplateSets', 'GET');
    client.registerMethod('fetchEmailTemplateSet', baseURL + '/emailTemplateSets/${id}', 'GET');
    client.registerMethod('createEmailTemplateSet', baseURL + '/emailTemplateSets', 'POST');
    client.registerMethod('updateEmailTemplateSet', baseURL + '/emailTemplateSets/${id}', 'PUT');
    client.registerMethod('deleteEmailTemplateSet', baseURL + '/emailTemplateSets/${id}', 'DELETE');

    // Email Templates: http://support.mashery.com/docs/read/mashery_api/30/resources/emailtemplatesets/emailtemplates
    client.registerMethod('fetchAllEmailTemplates', baseURL + '/emailTemplateSets/${emailSetId}/emailTemplates', 'GET');
    client.registerMethod('fetchEmailTemplate', baseURL + '/emailTemplateSets/${emailSetId}/emailTemplates/${id}', 'GET');
    client.registerMethod('createEmailTemplate', baseURL + '/emailTemplateSets/${emailSetId}/emailTemplates', 'POST');
    client.registerMethod('updateEmailTemplate', baseURL + '/emailTemplateSets/${emailSetId}/emailTemplates/${id}', 'PUT');
    client.registerMethod('deleteEmailTemplate', baseURL + '/emailTemplateSets/${emailSetId}/emailTemplates/${id}', 'DELETE');

    wrapMethods();
}


var exports = module.exports = {};

exports.init = function(_options){
    var requiredOptions = [ 'user', 'pass', 'key', 'secret', 'areaUuid' ],
        missingOptions  = _.difference(requiredOptions, _.keys(_options));

    if(missingOptions.length){
        throw new Error('The following options are required: ' + missingOptions.join(', '));
    }

    _.extend(options, _options);

    client = new Client({
        user: _options.key,
        password: _options.secret
    });

    registerClientMethods();

    client.getAccessToken = function(){ return accessToken; };

    return client;
};