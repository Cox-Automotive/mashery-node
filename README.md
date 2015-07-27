# Mashery REST API Client

Node.js client for the Mashery REST API (v3).

## Getting Started
Install the module with `npm install masherynode -g`


```
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
* fetchAllServices
* fetchService
* createService
* updateService
* deleteService

### Endpoints
* fetchAllServiceEndpoints
* fetchServiceEndpoint
* createServiceEndpoint
* updateServiceEndpoint
* deleteServiceEndpoint

### Methods
* fetchAllEndpointMethods
* fetchEndpointMethod
* createEndpointMethod
* updateEndpointMethod
* deleteEndpointMethod

### Service Roles

* fetchAllServiceRoles
* fetchServiceRole
* createServiceRole
* updateServiceRole
* deleteServiceRole

### Packages

* fetchAllPackages
* fetchPackage
* createPackage
* updatePackage
* deletePackage

### Plans

* fetchAllPlans
* fetchPlan
* createPlan

### Plan Services
* fetchAllPlanServices
* createPlanService
* createPlanEndpoint
* createPlanMethod

### Domains

* fetchAllDomains
* fetchDomain
* createDomain
* fetchPublicDomains
* fetchPublicDomainFQDNs
* fetchSystemDomains
* fetchSystemDomainFQDNs

### Roles
* fetchAllRoles

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