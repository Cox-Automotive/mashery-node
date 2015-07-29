[![Build Status](https://travis-ci.org/Cox-Automotive/mashery.svg?branch=master)](https://travis-ci.org/Cox-Automotive/mashery)

# Mashery REST API Client

Node.js client for the Mashery REST API (v3).

## Getting Started
Install the module with `npm install masherynode -g`


```javascript
var mashery = require('mashery');

// initialize the API client
var api = mashery.init({
    user: '<user_id>,
    pass: '<user_pass>,
    key: '<api_key>',
    secret: '<api_secret>',
    areaUuid: '<area_uuid>'
});

// note authentication will be automatically handled for you

// list all services
apiClient.methods.fetchAllServices({}, function(serviceData, serviceRawResponse){
	console.log(JSON.stringify(serviceData, null, 4));
});

// add an endpoint to an existing service
var args = {
	path: { serviceId: '<service_id>' },
    data: {<JSON_object_representing_endpoint>}
};

apiClient.methods.createServiceEndpoint(args, function(epData, epRawResponse){
	console.log(JSON.stringify(epData, null, 4));
});

```

## Supported Methods

### Services
[Service Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/services)

| Method | Args |
| ------ | ---- |
| fetchAllServices | |
| fetchService | id | 
| createService | | 
| updateService | id | 
| deleteService | id | 

### Endpoints
[Endpoint Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/services/endpoints)

| Method | Args |
| ------ | ---- |
| fetchAllServiceEndpoints | id | 
| fetchServiceEndpoint | serviceId, id | 
| createServiceEndpoint | | 
| updateServiceEndpoint | serviceId, id |
| deleteServiceEndpoint | serviceId, id |

### Methods
[Method Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans/services/endpoints/methods)

| Method | Args |
| ------ | ---- |
| fetchAllEndpointMethods | serviceId, endpointId | 
| fetchEndpointMethod | serviceId, endpointId, id | 
| createEndpointMethod | serviceId, endpointId | 
| updateEndpointMethod | serviceId, endpointId, id | 
| deleteEndpointMethod | serviceId, endpointId, id | 

### Service Roles
[Role Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/services/roles)

| Method | Args |
| ------ | ---- |
| fetchAllServiceRoles | id | 
| fetchServiceRole |  serviceId, id | 
| createServiceRole | serviceId | 
| updateServiceRole | serviceId, id | 
| deleteServiceRole | serviceId, id | 

### Packages
[Package Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/packages)

| Method | Args |
| ------ | ---- |
| fetchAllPackages | | 
| fetchPackage | id | 
| createPackage | | 
| updatePackage | | 
| deletePackage | | 

### Plans
[Plan Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans)

| Method | Args |
| ------ | ---- |
| fetchAllPlans | packageId | 
| fetchPlan | packageId, id | 
| createPlan | packageId | 

### Plan Services
[Plan Services Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/packages/plans/services)

| Method | Args |
| ------ | ---- |
| fetchAllPlanServices | packageId, planId | 
| createPlanService | packageId, planId| 
| createPlanEndpoint | packageId, planId, serviceId | 
| createPlanMethod | packageId, planId, serviceId, endpointId | 

### Domains
[Domains Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/domains)

| Method | Args |
| ------ | ---- |
| fetchAllDomains | | 
| fetchDomain | | 
| createDomain | | 


[Public Domains Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/domains/public)

| Method | Args |
| ------ | ---- |
| fetchPublicDomains | | 


[FQDN Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/domains/public/hostnames)

| Method | Args |
| ------ | ---- |
| fetchPublicDomainFQDNs | | 

[System Domain Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/domains/system)

| Method | Args |
| ------ | ---- |
| fetchSystemDomains | | 


### Roles
[Roles Documentation](http://support.mashery.com/docs/read/mashery_api/30/resources/roles)

| Method | Args |
| ------ | ---- |
| fetchAllRoles | | 

##Authors

**Brian Antonelli**

+ http://github.com/brianantonelli

## Copyright and license

Copyright (c) 2015 Cox Automotive

Licensed under the MIT License (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the COPYING file.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.