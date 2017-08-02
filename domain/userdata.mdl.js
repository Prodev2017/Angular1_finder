function UserDataCollection() {

    this.currentListView = '';

    this.lists = [];

    this.currentList = 'My List';

    this.tours = [];

    this.currentTour = 'My Tour';

    this.savedSearches = [];

    this.currentSavedSearchName = '';

    this.currentListSortOrder = 'ranking';

    //Begin Mock Data

  /*  var properties1 = [
            {
                propertyId: 1,
                mlstable: 'REBGV_RES',
                mlsnum: 'A13505',
                firstPhotoUrl: 'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_2.jpg',
                streetAddress:'249 Lockford',
                city:'Irvine',
                state:'CA',
                postalCode:'92602',
                listPrice:675000,
                propertyType:'Condo',
                transactionType: 'For Rent',
                specialConditions:[],
                beds:3,
                baths:2,
                sqft:1892,
                lotsize:null,
                yearBuilt:2003,
                hoaFees:346,
                dom:20,
                ppsqft:124,
                remarksSummary:'This upgraded end unit Nothpark condo is move-in ready.Rich hardwood floors, fresh neutral paint, recessed lighting, crown molding and upgraded baseboards complement the bright and open floorplan. The inviting, second-level living room offers coffered ceilings, a cozy fireplace, a custom built-in media center and sliding doors to the spacious and private balcony. The living room flows to the attached dining room and to the kitchen. The kitchen is well-appointed with granite counters, stainless steel appliances and a breakfast bar.',
                agentComments:'This one may interest you',
                clientComments:'I like the living room.',
                rating: 1,
                sortOrder:0,
                addingComment:false,
                latlng:{lat:33.736473, lng:-117.766886}
            },
            {
                propertyId: 2,
                mlstable: 'REBGV_RES',
                mlsnum: 'C35033',
                firstPhotoUrl: 'https://ssl.cdn-redfin.com/system_files/media/30907_JPG/genLdpUgcMediaBrowserUrl/item_17.jpg',
                streetAddress:'14 Maribella Aisle',
                city:'Irvine',
                state:'CA',
                postalCode:'92614',
                listPrice:465000,
                propertyType:'Home',
                transactionType: 'For Sale',
                specialConditions:[],
                beds:3,
                baths:2,
                sqft:1892,
                lotsize:null,
                yearBuilt:2003,
                hoaFees:346,
                dom:32,
                ppsqft:180,
                remarksSummary:'Completely remodeled, this upstairs end-unit condo in the Westpark Tiempo community of Irvine is move-in ready. Rich wood laminate floors throughout, custom baseboards and door trims, vaulted and scraped ceilings and recessed lighting complement the bright and open floorplan. Enter into the inviting living room with a cozy gas fireplace. The living room flows to the dining room with a custom built-in work desk area with two desks which can also be used as a buffet area. The kitchen is well appointed with quartz counters and backsplash, new white shaker soft-close cabinets',
                agentComments:'This one is recently on the market and has a great backyard',
                clientComments:'I like this one but it\'s a bit far',
                rating: 2,
                sortOrder:1,
                addingComment:false,
                latlng:{lat:33.684499,lng: -117.827606}
            },
            {
                propertyId: 3,
                mlstable: 'REBGV_RES',
                mlsnum: 'Q12505',
                firstPhotoUrl: 'https://ssl.cdn-redfin.com/system_files/media/32144_JPG/genLdpUgcMediaBrowserUrl/item_1.jpg',
                streetAddress:'195 Compass',
                city:'Irvine',
                state:'CA',
                postalCode:'92618',
                listPrice:1295888,
                propertyType:'Home',
                transactionType: 'For Sale',
                specialConditions:['OPEN Sat 1PM','Short Sale'],
                beds:3,
                baths:2.5,
                sqft:2194,
                lotsize:8046,
                yearBuilt:2013,
                hoaFees:173,
                dom:120,
                ppsqft:210,
                remarksSummary:'This formal model home is a buyer’s dream. This Largest backyard is an entertainer’s delight that has a decked out pavilion with BBQ area, T. V. , fridge, bar seating, Bocci ball court and citrus garden. This home that has no houses in front features plantation shutters, recessed lighting, epoxy floors in garage, sonos ready entertainment and extensive upgrades throughout that add to the elegance of the bright and open floor plan. Enter this upgraded home to extensive reclaimed woodwork on the ceiling, on into the well-appointed chef’s kitchen with solid counters, stainless steel appliances, a farmhouse sink, solid wood cabinets, and a large center island with bar seating',
                agentComments:'The home is on a cul de sac and has a small pool',
                clientComments:'',
                rating: 0,
                sortOrder:2,
                addingComment:false,
                latlng:{lat:33.697246,lng: -117.729241}
            },
            {
                propertyId: 4,
                mlstable: 'REBGV_RES',
                mlsnum: 'A53303',
                firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/832/genMid.PW17068832_0.jpg',
                streetAddress:'6 Remington',
                city:'Irvine',
                state:'CA',
                postalCode:'92620',
                listPrice:1295888,
                propertyType:'Condo',
                transactionType: 'For Sale',
                specialConditions:['OPEN SAT 2PM'],
                beds:2,
                baths:2,
                sqft:955,
                lotsize:8046,
                yearBuilt:1986,
                hoaFees:293,
                dom:6,
                ppqsft:150,
                remarksSummary:'Nestled in a charming tree-lined village of Northwood, this stylish corner townhome boasts a desirable private location with lush greenbelt views. Dramatic open layout with all living space on one level, and nobody above or below, makes a striking impression and offers designer upgrades that reveal pride of ownership and surpass every home in this price range. Inviting entry welcomes guests upstairs where soaring ceilings and walls of windows offer inspiring panoramic views and lots of natural light. Bright white kitchen features granite countertops overlooking casual dining and generous great room, offering stylish ambiance and comfortable living space.',
                agentComments:'',
                clientComments:'check if it has a basement',
                rating: 3,
                sortOrder:3,
                addingComment:false,
                latlng:{lat:33.699495,lng: -117.770452}
            },
            {
                propertyId: 5,
                mlstable: 'REBGV_RES',
                mlsnum: 'B25955',
                firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/545/genMid.OC17069545_0.jpg',
                streetAddress:'17245 Citron',
                city:'Irvine',
                state:'CA',
                postalCode:'92612',
                listPrice:750000,
                propertyType:'Home',
                transactionType: 'For Sale',
                specialConditions:['OPEN SAT 3PM'],
                beds:3,
                baths:2,
                sqft:1532,
                lotsize:4922,
                yearBuilt:1974,
                hoaFees:490,
                dom:18,
                ppsqft:182,
                remarksSummary:'GORGEOUS. .Desirable SINGLE level home on greenbelt. Beautifully upgraded with quality upgrades. . As you enter you will be delighted with the dramatic features, large living room with vaulted ceilings & custom fireplace & stone tile floors. Separate formal dining room. 3 spacious bedrooms (one used as a den/office) 2 remodeled bathrooms. Romantic master suite with dual closets with organized. The bedrooms all have wood floors. All windows & sliding doors have been replaced with vinyl windows & sliders. Gourmet chefs kitchen, redone with granite counters, glass front on some doors, gas stove, large eat in nook & great light from the many windows',
                agentComments:'',
                clientComments:'',
                rating: 1,
                sortOrder:4,
                addingComment:false,
                latlng:{lat:33.662881,lng: -117.801892}
            },
            {
                propertyId: 6,
                mlstable: 'REBGV_RES',
                mlsnum: 'B33302',
                firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/58/mbpaddedwide/703/genMid.317002703_0.jpg',
                streetAddress:'9 Garzoni Aisle',
                city:'Irvine',
                state:'CA',
                postalCode:'92606',
                listPrice:449950,
                propertyType:'Condo',
                transactionType: 'For Sale',
                specialConditions:['Short Sale'],
                beds:2,
                baths:1.5,
                sqft:1022,
                lotsize:null,
                yearBuilt:1992,
                hoaFees:364,
                dom:25,
                ppsqft:135,
                remarksSummary:'Enjoy European Architecture, Fountains & Statues In Gated Community. Granite Entry Leads To Cozy Living Room W/ Fireplace. Dining Room & Kitchen Located On The Same Level. Den W/ Full Size Closet Could Be 2nd Br/Office/ Family Rm. Spacious Master Suite W/ Walk In Closet. Master Bath Includes Luxurious Roman Tub & Dual Vanities. Great Courtyard Location',
                agentComments:'',
                clientComments:'',
                rating: 0,
                sortOrder:5,
                addingComment:false,
                latlng:{lat:33.687104,lng: -117.818839}
            }
        ];

    var properties2 = [
        {
            propertyId: 7,
            mlstable: 'REBGV_RES',
            mlsnum: 'A52205',
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/892/genMid.OC17065892_0.jpg',
            streetAddress:'45 Commonwealth',
            city:'Irvine',
            state:'CA',
            postalCode:'92615',
            listPrice:1068980,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 1PM'],
            beds:4,
            baths:2.75,
            sqft:2363,
            lotsize:4305,
            yearBuilt:2000,
            hoaFees:149,
            dom:39,
            ppsqft:192,
            remarksSummary:'This is an immaculate light and bright detached home desirably located on a prime cul-de-sac in a hidden jewel-like location, in the gated Oak Creek! Enjoy a stress-free lifestyle by living within walking distance to shopping centers, restaurants, award-winning schools, swimming pools, tot lots, and more!5 minutes or less driving distance to hospitals, universities, and freeways. Enjoy a mini mansion with appealing curb, a covered porch that opens up to luxury living space. Offers 4 bedrooms, 3 baths, one loft, large master bedroom retreat, one bedroom and one shower bathroom on the main floor. Open floor plan invites sunshine and breeze to fill it while the fireplace centered in the living room for evening ambiance!New granite counter top installed in the kitchen with customized kitchen cabinetry, upgraded pantry, premium stainless steel appliances',
            agentComments:'',
            clientComments:'',
            rating: 2,
            sortOrder:6,
            addingComment:false,
            latlng:{lat:33.665354,lng: -117.778654}
        },
        {
            propertyId:8,
            mlstable: 'REBGV_RES',
            mlsnum: 'C223505',
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/840/genMid.OC17057840_0.jpg',
            streetAddress:'218 Landmark Lane',
            city:'Irvine',
            state:'CA',
            postalCode:'92782',
            listPrice:688888,
            propertyType:'Condo',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 5PM'],
            beds:4,
            baths:4,
            sqft:2213,
            lotsize:null,
            yearBuilt:2005,
            hoaFees:220,
            dom:56,
            ppsqft:122,
            remarksSummary:'Beautiful Tustin Field Innovative Townhome with flexible floor plan is ready for its new owner! This interior location home is only attached on 1st level and features 4 bedrooms 4 Bathrooms ~ 1 Master Suite and 2 Junior Suites! Step inside to this beautiful upgraded home that invites you with a charming living room with a cozy fireplace. The open floor plan leads you to the Gourmet kitchen with Granite Counters, Gorgeous Backsplash, & Stainless Steel Appliances. The spacious dining area perfectly compliments the utility of the Kitchen layout. ',
            agentComments:'',
            clientComments:'',
            rating: 0,
            sortOrder:7,
            addingComment:false,
            latlng:{lat:33.704689,lng: -117.802754}
        }
    ];

    var properties3 = [
        {
            propertyId:8,
            mlstable: 'REBGV_RES',
            mlsnum: 'C223505',
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/840/genMid.OC17057840_0.jpg',
            streetAddress:'218 Landmark Lane',
            city:'Irvine',
            state:'CA',
            postalCode:'92782',
            listPrice:688888,
            propertyType:'Condo',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 5PM'],
            beds:4,
            baths:4,
            sqft:2213,
            lotsize:null,
            yearBuilt:2005,
            hoaFees:220,
            dom:56,
            ppsqft:122,
            remarksSummary:'Beautiful Tustin Field Innovative Townhome with flexible floor plan is ready for its new owner! This interior location home is only attached on 1st level and features 4 bedrooms 4 Bathrooms ~ 1 Master Suite and 2 Junior Suites! Step inside to this beautiful upgraded home that invites you with a charming living room with a cozy fireplace. The open floor plan leads you to the Gourmet kitchen with Granite Counters, Gorgeous Backsplash, & Stainless Steel Appliances. The spacious dining area perfectly compliments the utility of the Kitchen layout. ',
            agentComments:'',
            clientComments:'',
            rating: 0,
            sortOrder:7,
            addingComment:false,
            latlng:{lat:33.704689,lng: -117.802754}
        }
    ];

    var properties4 = [
        {
            propertyId: 7,
            mlstable: 'REBGV_RES',
            mlsnum: 'A52205',
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/892/genMid.OC17065892_0.jpg',
            streetAddress:'45 Commonwealth',
            city:'Irvine',
            state:'CA',
            postalCode:'92615',
            listPrice:1068980,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 1PM'],
            beds:4,
            baths:2.75,
            sqft:2363,
            lotsize:4305,
            yearBuilt:2000,
            hoaFees:149,
            dom:39,
            ppsqft:192,
            remarksSummary:'This is an immaculate light and bright detached home desirably located on a prime cul-de-sac in a hidden jewel-like location, in the gated Oak Creek! Enjoy a stress-free lifestyle by living within walking distance to shopping centers, restaurants, award-winning schools, swimming pools, tot lots, and more!5 minutes or less driving distance to hospitals, universities, and freeways. Enjoy a mini mansion with appealing curb, a covered porch that opens up to luxury living space. Offers 4 bedrooms, 3 baths, one loft, large master bedroom retreat, one bedroom and one shower bathroom on the main floor. Open floor plan invites sunshine and breeze to fill it while the fireplace centered in the living room for evening ambiance!New granite counter top installed in the kitchen with customized kitchen cabinetry, upgraded pantry, premium stainless steel appliances',
            agentComments:'',
            clientComments:'',
            rating: 2,
            sortOrder:6,
            addingComment:false,
            latlng:{lat:33.665354,lng: -117.778654}
        },
        {
            propertyId:8,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/840/genMid.OC17057840_0.jpg',
            streetAddress:'218 Landmark Lane',
            city:'Irvine',
            state:'CA',
            postalCode:'92782',
            listPrice:688888,
            propertyType:'Condo',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 5PM'],
            beds:4,
            baths:4,
            sqft:2213,
            lotsize:null,
            yearBuilt:2005,
            hoaFees:220,
            dom:56,
            ppsqft:122,
            remarksSummary:'Beautiful Tustin Field Innovative Townhome with flexible floor plan is ready for its new owner! This interior location home is only attached on 1st level and features 4 bedrooms 4 Bathrooms ~ 1 Master Suite and 2 Junior Suites! Step inside to this beautiful upgraded home that invites you with a charming living room with a cozy fireplace. The open floor plan leads you to the Gourmet kitchen with Granite Counters, Gorgeous Backsplash, & Stainless Steel Appliances. The spacious dining area perfectly compliments the utility of the Kitchen layout. ',
            agentComments:'',
            clientComments:'',
            rating: 0,
            sortOrder:7,
            addingComment:false,
            latlng:{lat:33.704689,lng: -117.802754}
        }
    ];

    this.properties = properties1;

    this.properties.concat(properties2)

    var propertyListAll =
        {
            propertyListId:0,
            name: 'All',
            createdByAgent: false,
            updated: 'Mar 28 2017',
            properties: []
        }

    propertyListAll.properties = this.properties;

    var propertyList1 =
        {
            propertyListId:1,
            name: 'Burnaby',
            createdByAgent: false,
            updated: 'Mar 28 2017',
            properties: []
        }

    propertyList1.properties = properties1;

    var propertyList2 =
        {
            propertyListId:2,
            name:'Bowen Island',
            createdByAgent: false,
            updated:' April 1 2017',
            properties: []
        }

    propertyList2.properties = properties2;

    var propertyList3 =
        {
            propertyListId:3,
            name:'Burnaby MetroTown',
            updated: 'April 5 2017',
            createdByAgent: false,
            properties: []
        }

    propertyList3.properties = properties3;

    var propertyList4 =
        {
            propertyListId:10,
            name:'Bowen Island and Surroundings',
            createdByAgent: true,
            updated:' April 1 2017',
            properties: []
        }

    propertyList4.properties = properties4;

    this.propertyListData = [];

    this.propertyListData.push(propertyListAll);

    this.propertyListData.push(propertyList1);

    this.propertyListData.push(propertyList2);

    this.propertyListData.push(propertyList3);

    this.propertyListData.push(propertyList4);

    var tour =
        {
            propertyTourId:2,
            name:'Bowen Island',
            createdByAgent: false,
            created:' April 1 2017',
            startingLocation: '5445 Alton Pkwy Irvine, CA 92604',
            startingLatLng: {lat:0,lng:0},
            properties: [
                {
                    propertyId: 7,
                    distance: 1.2,
                    mlstable: 'REBGV_RES',
                    mlsnum: 'A52205',
                    firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/892/genMid.OC17065892_0.jpg',
                    streetAddress:'45 Commonwealth',
                    city:'Irvine',
                    state:'CA',
                    postalCode:'92615',
                    listPrice:1068980,
                    propertyType:'Home',
                    transactionType: 'For Sale',
                    specialConditions:['OPEN SAT 1PM'],
                    beds:4,
                    baths:2.75,
                    sqft:2363,
                    lotsize:4305,
                    yearBuilt:2000,
                    hoaFees:149,
                    dom:39,
                    ppsqft:192,
                    remarksSummary:'This is an immaculate light and bright detached home desirably located on a prime cul-de-sac in a hidden jewel-like location, in the gated Oak Creek! Enjoy a stress-free lifestyle by living within walking distance to shopping centers, restaurants, award-winning schools, swimming pools, tot lots, and more!5 minutes or less driving distance to hospitals, universities, and freeways. Enjoy a mini mansion with appealing curb, a covered porch that opens up to luxury living space. Offers 4 bedrooms, 3 baths, one loft, large master bedroom retreat, one bedroom and one shower bathroom on the main floor. Open floor plan invites sunshine and breeze to fill it while the fireplace centered in the living room for evening ambiance!New granite counter top installed in the kitchen with customized kitchen cabinetry, upgraded pantry, premium stainless steel appliances',
                    agentComments:'',
                    clientComments:'',
                    rating: 2,
                    sortOrder:6,
                    addingComment:false,
                    latlng:{lat:33.665354,lng: -117.778654}
                },
                {
                    propertyId:8,
                    distance: 1.8,
                    mlstable: 'REBGV_RES',
                    mlsnum: 'C223505',
                    firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/840/genMid.OC17057840_0.jpg',
                    streetAddress:'218 Landmark Lane',
                    city:'Irvine',
                    state:'CA',
                    postalCode:'92782',
                    listPrice:688888,
                    propertyType:'Condo',
                    transactionType: 'For Sale',
                    specialConditions:['OPEN SAT 5PM'],
                    beds:4,
                    baths:4,
                    sqft:2213,
                    lotsize:null,
                    yearBuilt:2005,
                    hoaFees:220,
                    dom:56,
                    ppsqft:122,
                    remarksSummary:'Beautiful Tustin Field Innovative Townhome with flexible floor plan is ready for its new owner! This interior location home is only attached on 1st level and features 4 bedrooms 4 Bathrooms ~ 1 Master Suite and 2 Junior Suites! Step inside to this beautiful upgraded home that invites you with a charming living room with a cozy fireplace. The open floor plan leads you to the Gourmet kitchen with Granite Counters, Gorgeous Backsplash, & Stainless Steel Appliances. The spacious dining area perfectly compliments the utility of the Kitchen layout. ',
                    agentComments:'',
                    clientComments:'',
                    rating: 0,
                    sortOrder:7,
                    addingComment:false,
                    latlng:{lat:33.704689,lng: -117.802754}
                }
            ]
        }

    this.tourData = [];

    this.tourData.push(tour);

    this.removedProperties = [];

    this.propertySearches =
        [
            {
                propertySearchId: 1,
                name:'Burnaby',
                created:'Apr 12 2017',
                createdByAgent:false,
                type:'city',
                area:[{name:'city',value:'Burnaby'},{name:'province',value:'Vancouver'}],
                criteria: [{name:'max-price',value:'350000'},{name:'min-beds',value:'3'}],
                updateOption:1
            },
            {
                propertySearchId: 2,
                name:'MetroTown Burnaby',
                created:'Apr 5 2017',
                createdByAgent:false,
                type:'area',
                area: [{name:'id',value:125}],
                criteria: [{name:'max-price',value:'350000'},{name:'min-beds',value:'3'},{name:'type',value:'Condo,Townhouse'}],
                updateOption:2
            },
            {
                propertySearchId: 1,
                name:'Burnaby',
                created:'Mar 31 2017',
                createdByAgent:true,
                type:'city',
                area: [{name:'city',value:'Burnaby'},{name:'province',value:'Vancouver'}],
                criteria: [{name:'max-price',value:'350000'},{name:'min-beds',value:'3'}],
                updateOption:0
            }
        ];

    this.contactInfo =
        {

            name: '',
            email:'',
            mobilePhone:'',
            otherPhone:''
        };*/

    //End Mock Data

    this.SavedSearchesRequest = null;
}

//Saved Property Lists

UserDataCollection.prototype.GetPropertyListSortOrderOptions = function() {

    return [
        {name:'Ranking',id:'ranking'},
        {name:'Price Hi-Lo',id:'listprice desc'},
        {name:'Price Lo-Hi',id:'listprice'},
        {name:'Newest First',id:'adddate desc'},
        {name:'Oldest First',id:'adddate'},
        {name:'Beds Hi-Lo',id:'beds desc'},
        {name:'Beds Lo-Hi',id:'beds'},
        {name:'Baths Hi-Lo',id:'baths desc'},
        {name:'Baths Lo-Hi',id:'baths'},
        {name:'SqFt Hi-Lo',id:'sqft desc'},
        {name:'Sqft Lo-Hi',id:'sqft'},
        {name:'Year Hi-Lo',id:'yearbuilt desc'},
        {name:'Year Lo-Hi',id:'yearbuilt'},
        {name:'LotSize Hi-Lo',id:'lotsize desc'},
        {name:'LotSize Lo-Hi',id:'lotsize'},
        {name:'PPSqFt Hi-Lo',id:'ppsqft desc'},
        {name:'PPSqFT Lo-Hi',id:'ppsqft'}
    ];
}

UserDataCollection.prototype.GetSavedPropertyLists = function(successCallback,context,combine) {

    var that = this;

    $.ajax({

        url:rea_domain+'/leads/savedpropertylists',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (lists) {

            that.lists = lists;

            var found = false;

            var first = '';

            for(var j=0;j<lists.mylists.length;j++) {

                if(j==0)first = lists.mylists[j].name;

                if(lists.mylists[j].name==that.currentList) {

                    found = true;

                    break;
                }
            }

            if(!found) {

                var second = '';

                for(var k=0;k<lists.agentlists.length;k++) {

                    if(k==0)second = lists.agentlists[k].name;

                    if(lists.agentlists[k].name==that.currentList) {

                        found = true;

                        break;
                    }
                }

                if(!found) {

                    if(first!='')that.currentList = first;
                    else that.currentList = second;
                }
            }

            if(combine) {

                var clist = [];

                for(var n=0;n<lists.mylists.length;n++) {

                    clist.push(lists.mylists[n]);
                }

                for(var i=0;i<lists.agentlists.length;i++) {

                    clist.push(lists.agentlists[i]);
                }

                lists = clist;
            }

            successCallback.call(context,lists);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting saved property lists: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    //Begin Mock Data

   /* var list = [];

    for(var i=0;i<this.propertyListData.length;i++) {

        var theItem = this.propertyListData[i];

        if(theItem.propertyListId==0)continue;

        list.push(theItem);
    }

    return list;*/

    //End Mock Data
}

UserDataCollection.prototype.AddSavedPropertyList = function(name,successCallback,context) {

    var that = this;

    $.ajax({

        url:rea_domain+'/leads/createsavedpropertylist',
        cache: false,
        data: "name="+name,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            that.currentList = name;

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error creating saved property list: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /* var id = this.propertyListData.length+1;

     var list = {

         propertyListId: id,
         name: name,
         createdByAgent:false,
         updated: new Date(),
         properties: []
     }

     this.propertyListData.push(list);

     return id;*/
}

UserDataCollection.prototype.RenameSavedPropertyList = function(list,newName,successCallback,context) {

    var params = "name="+newName;

    if(rea_util.IsNumber(list))params += "&listid="+list;
    else params += "&listname="+list;

    $.ajax({

        url:rea_domain+'/leads/renamesavedpropertylist',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error renaming saved property list: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

   /* if(listId<=0) {

        console.log("Attempt to Rename 'All' List");

        return;
    }

    var list = this.GetPropertyList(listId);

    if(!list) {

        console.log("Attempt to Rename Non-Existent List "+listId);

        return;
    }

    list.name = newName;*/
}

UserDataCollection.prototype.RemoveSavedPropertyList = function(list,successCallback,context) {

    var params = "";

    if(rea_util.IsNumber(list))params = "listid="+list;
    else params = "listname="+list;

    $.ajax({

        url:rea_domain+'/leads/removesavedpropertylist',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error removing saved property list: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

   /* if(listId<=0) {

        console.log("Attempt to Remove 'All' List");

        return;
    }

    var fromIndex = -1;

    for(var n=0;n<this.propertyListData.length;n++) {

        if(this.propertyListData[n].propertyListId==listId) {

            fromIndex = n;

            break;
        }
    }

    if(fromIndex>=0)this.propertyListData.splice(fromIndex,1);*/
}

UserDataCollection.prototype.GetSavedPropertyList = function(list,sortOrder,successCallback,context) {

    var params = "sort="+sortOrder;

    if(rea_util.IsNumber(list))params += "&listid="+list;
    else if(list.toLowerCase()=='all properties')params ='';
    else params += "&listname="+list;

    $.ajax({

        url:rea_domain+'/leads/savedproperties',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting saved properties for list: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /*//TBD retrieve this data from DB

     for(var n=0;n<this.propertyListData.length;n++) {

     if(this.propertyListData[n].propertyListId==listId)return this.propertyListData[n];
     }

     return null;*/
}

UserDataCollection.prototype.GetSavedProperty = function(savedPropertyID,successCallback,context) {

    $.ajax({

        url:rea_domain+'/leads/savedproperty',
        cache: false,
        data: "propertyid="+savedPropertyID,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting saved property: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /*for(var m=0;m<this.properties.length;m++) {

     if(this.properties[m].propertyId == propertyId) {

     return this.properties[m];
     }
     }

     return null;*/
}

UserDataCollection.prototype.SaveProperty = function(idxtable,listingID,viewedOnly,listname,successCallback,context) {

    var viewed = false;

    if(viewedOnly)viewed = true;

    var params = "idxtable="+idxtable+"&listingid="+listingID+"&viewedonly="+viewed;

    if(listname)params += '&listname='+listname;

    $.ajax({

        url:rea_domain+'/leads/saveproperty',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (property) {

            if(successCallback)successCallback.call(context,property);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error saving property: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /*property.propertyId = this.properties.length+1;

    this.properties.push(property);

    return property.propertyId;*/
}

UserDataCollection.prototype.AddPropertiesToList = function(list,properties,viewedOnly,successCallback,context) {

    var viewed = 0;

    if(viewedOnly)viewed = 1;

    var params = "viewedonly="+viewed;

    if(rea_util.IsObject(properties))
    {
        var idxtables = [];

        var listingids = [];

        for (var i = 0; i < properties.length; i++) {

            var property = properties[i];

            idxtables.push(property.idxtable);

            listingids.push(property.listingid);
        }

        params += "&idxtables=" + idxtables.toString() + "&listingids=" + listingids.toString();
    }
    else {

        params += "&savedpropertyids="+properties;
    }

    if(rea_util.IsNumber(list))params += "&listid="+list;
    else params += "&listname="+list;

    $.ajax({

        url: rea_domain+'/leads/addtosavedpropertylist',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding properties to list: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function () {


        }
    });
}

UserDataCollection.prototype.AddPropertyIDsToList = function(list,propertyIDs,viewedOnly,successCallback,context) {

    var viewed = 1;

    if(viewedOnly)viewed = 0;

    var params = "savedpropertyids=" + propertyIDs +"&viewedonly="+viewed;

    if(rea_util.IsNumber(list))params += "&listid="+list;
    else params += "&listname="+list;

    $.ajax({

        url: rea_domain+'/leads/addtosavedpropertylist',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding properties to list: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function () {


        }
    });
}

UserDataCollection.prototype.RemovePropertiesFromList = function(list,propertyIDs,successCallback,context) {

    var params = "savedpropertyids="+propertyIDs;

    if(rea_util.IsNumber(list))params += "&listid="+list;
    else params += "&listname="+list;

    $.ajax({

        url:rea_domain+'/leads/removefromsavedpropertylist',
        cache: false,
        data:params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error removing properties from list: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

   /* for(var i=0;i<propertyIds.length;i++) {

        this.RemovePropertyFromList(listId,propertyIds[i],archive)
    }*/
}

UserDataCollection.prototype.UpdateSavedPropertyRanking = function(list,propertyIDs) {

    var params = "savedpropertyids="+propertyIDs;

    if(rea_util.IsNumber(list))params += "&listid="+list;
    else params += "&listname="+list;

    var that = this;

    $.ajax({
        url:rea_domain+'/leads/updatesavedpropertyranking',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error updating saved property list ranking: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

}

UserDataCollection.prototype.UpdateClientComments = function(propertyID,comments,successCallback,context) {

    var params = "propertyid="+propertyID+'&comments='+encodeURIComponent(comments);

    $.ajax({

        url:rea_domain+'/leads/updateleadcomments',
        cache: false,
        data:params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error updating saved property comment: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

//Saved Property Tours

UserDataCollection.prototype.GetTours =function(successCallback,context,combine) {

    var that = this;

    $.ajax({

        url:rea_domain+'/leads/savedpropertytours',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (tours) {

            that.tours = tours;

            if(combine) {

                if(combine) {

                    var ctour = [];

                    for(var n=0;n<tours.mytours.length;n++) {

                        ctour.push(tours.mytours[n]);
                    }

                    for(var i=0;i<tours.agenttours.length;i++) {

                        ctour.push(tours.agenttours[i]);
                    }
                }

                tours = ctour;
            }

            if(successCallback)successCallback.call(context,tours);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting saved property tours: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    //Begin Mock Data

    //return this.tourData;

    //End Mock Data
}

UserDataCollection.prototype.GetTour = function(tour,successCallback,context) {

    var params;

    if(rea_util.IsNumber(tour))params = "tourid="+tour;
    else params = "tourname="+tour;

    $.ajax({

        url:rea_domain+'/leads/getpropertytour',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting saved property tour: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

UserDataCollection.prototype.AddTour = function(name,startingLocation,successCallback,context) {

    $.ajax({

        url:rea_domain+'/leads/addpropertytour',
        cache: false,
        data: "name="+name+'&startinglocation='+startingLocation,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error creating property tour: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /*var id = this.tourData.length+1;

    var tour = {

        propertyTourId: id,
        name: name,
        startingLocation: startingLocation,
        startingLatLng: startingLatLng,
        created: new Date(),
        byAgent:false,
        properties: []
    }

    this.tourData.push(tour);

    return id;*/
}

UserDataCollection.prototype.RenameTour = function(tour,newName,successCallback,context) {

    var params = "name="+newName;

    if(rea_util.IsNumber(tour))params += "tourid="+tour;
    else params += "tourname="+tour;

    $.ajax({

        url:rea_domain+'/leads/renamepropertytour',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error renaming tour: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /* var search = this.GetPropertySearch(searchId);

     if(!search) {

     console.log("Attempt to Rename Non-Existent Search "+searchId);

     return;
     }

     search.name = newName;*/
}

UserDataCollection.prototype.UpdateTour = function(tour,newName,successCallback,context) {

    var params = "name="+newName;

    if(rea_util.IsNumber(tour))params += "&tourid="+tour;
    else params += "&tourname="+tour;

    $.ajax({

        url:rea_domain+'/leads/updatepropertytour',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error updating property tour: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /*var tour = this.GetTour(tourId);

     if(torr==null) {

     console.log("Attempt to Update Non-Existent Tour");

     return;
     }

     tour.name = newName;

     tour.startingLocation = newStartingLocation;

     tour.startingLatLng = newLatLng;*/
}

UserDataCollection.prototype.RemoveTour = function(tour,successCallback,context) {

    var params = "";

    if(rea_util.IsNumber(tour))params = "tourid="+tour;
    else params = "tourname"+tour;

    $.ajax({

        url:rea_domain+'/leads/removepropertytour',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error removing property tour: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /*var index = -1;

     for(var i=0;i<this.tourData.length;i++) {

     if(this.tourData[i].propertyTourId==tourId) {

     index = i;

     break;
     }
     }

     if(index>=0)this.tourData.splice(index,1);*/
}

UserDataCollection.prototype.GetTourProperties = function(tour,startingLocation,successCallback,context) {

    var params = "";

    if(rea_util.IsNumber(tour))params = "tourid="+tour;
    else params = "tourname="+tour;

    if(startingLocation)params += "&startinglocation="+encodeURIComponent(startingLocation);

    $.ajax({

        url:rea_domain+'/leads/savedproperties',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'GET',
        success: function (properties) {

            successCallback.call(context,properties);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting saved properties for tour: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    /*//TBD retrieve this data from DB

     for(var n=0;n<this.propertyListData.length;n++) {

     if(this.propertyListData[n].propertyListId==listId)return this.propertyListData[n];
     }

     return null;*/
}

UserDataCollection.prototype.AddToTour = function(tour,propertyIDs,successCallback,context) {

    var params = "savedpropertyids="+propertyIDs;

    if(rea_util.IsNumber(tour))params += "&tourid="+tour;
    else params += "&tourname="+tour;

    var that = this;

    $.ajax({

        url:rea_domain+'/leads/addtopropertytour',
        cache: false,
        data:params,
        dataType: 'json',
        method: 'POST',
        success: function (ptour) {

            var found = false;

            for(var n=0;n<that.tours.mytours.length;n++) {

                if(that.tours.mytours.id==ptour.id) {

                    found = true;

                    break;
                }
            }

            if(!found)that.tours.mytours.push(ptour);

            if(successCallback)successCallback.call(context,ptour);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding properties to tour: "+status+" url:"+this.url+" data:"+this.params);
        },
        complete: function() {

        }
    });


    /*var tour = this.GetTour(tourId);

    if(tour==null) {

        console.log("Attempt to Add to Non-Existent Tour");

        return;
    }

    var fromList = this.GetPropertyList(this.currentListId);

    for(var n=0;n<propertyIds.length;n++) {

        var propertyId = propertyIds[n];

        var property = null;

        for(var m=0;m<fromList.properties.length;m++) {

            if(fromList.properties[m].propertyId==propertyId) {

                property = fromList.properties[m];

                break;
            }
        }

        if(property==null)continue;

        var found = false;

        for (var i = 0; i < tour.properties.length; i++) {

            if (tour.properties[i].propertyId == property.propertyId) {

                found = true;

                break;
            }
        }

        if(!found)tour.properties.push(property);
    }*/
}

UserDataCollection.prototype.RemoveFromTour = function(tour,propertyIDs,successCallback,context) {

    var params = "savedpropertyids="+propertyIDs;

    if(rea_util.IsNumber(tour))params += "&tourid="+tour;
    else params += "&tourname="+tour;

    $.ajax({

        url:rea_domain+'/leads/removefrompropertytour',
        cache: false,
        data:params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error removing properties from tour: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

   /* var tour = this.GetTour(this.currentTourId);

    if(tour==null) {

        console.log("Attempt to Remove From Non-Existent Tour");

        return;
    }

    var fromIndex = -1;

    for(var i=0;i<tour.properties.length;i++) {

        if(tour.properties[i].propertyId==propertyId) {

            fromIndex = i;

            break;
        }
    }

    if(fromIndex<0)return;

    tour.properties.splice(fromIndex,1);*/
}

//Saved Property Searches

UserDataCollection.prototype.GetSavedSearches = function(successCallback,context,combine) {

    if(this.SavedSearchesRequest!=null) {

        this.SavedSearchesRequest.abort();

        this.SavedSearchesRequest = null;
    }

    var that = this;

    this.SavedSearchesRequest = $.ajax({

        url:rea_domain+'/leads/savedsearches',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (searches) {

            if(combine) {

                var csearches = [];

                for(var n=0;n<searches.mysearches.length;n++) {

                    csearches.push(searches.mysearches[n]);
                }

                for(var i=0;i<searches.agentsearches.length;i++) {

                    csearches.push(searches.agentsearches[i]);
                }

                searches = csearches;
            }

            that.savedSearches = searches;

            successCallback.call(context,searches);
        },
        error: function(status) {

            if(!status)status='';

            console.log("Error getting saved searches: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.SavedSearchesRequest = null;
        }
    });

    //return this.propertySearches;
}

UserDataCollection.prototype.SaveSearch =function(name,propertyTypes,query,successCallback,context) {

    query.name = name;

    query.propertytypes = propertyTypes;

    $.ajax({

        url:rea_domain+'/leads/savesearch',
        cache: false,
        data: query,
        dataType: 'json',
        method: 'POST',
        success: function (search) {

            if(successCallback)successCallback.call(context,search);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error saving search: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

}

UserDataCollection.prototype.RenameSearch = function(search,newName,successCallback,context) {

    var params = "name="+newName;

    if(rea_util.IsNumber(search))params += "&searchid="+search;
    else params += "&searchname="+search;

    $.ajax({

        url:rea_domain+'/leads/renamesavedsearch',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error renaming search: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

   /* var search = this.GetPropertySearch(searchId);

    if(!search) {

        console.log("Attempt to Rename Non-Existent Search "+searchId);

        return;
    }

    search.name = newName;*/
}

UserDataCollection.prototype.UpdateSearchFrequency = function(search,frequency,successCallback,context) {

    var params = "savedsearchid="+search.id+"&frequency="+frequency;

    $.ajax({

        url:rea_domain+'/leads/updatesavedsearchfrequency',
        cache: false,
        data:params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error update search frequency: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

}

UserDataCollection.prototype.RemoveSearch= function(search,successCallback,context) {

    var params = "";

    if(rea_util.IsNumber(search))params = "searchid="+search;
    else params = "searchname="+search;

    $.ajax({

        url:rea_domain+'/leads/removesavedsearch',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error removing search: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

//Map

UserDataCollection.prototype.GetMapOptions = function(successCallback,context) {

    $.ajax({

        url:rea_domain+'/search/mapconfig',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (options) {

            successCallback.call(context,options);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error looking up map options: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });

    var sample =  {

        center: {lat: 49.246292, lng: -123.116226},
        zoom: 12,
        draggableCursor: 'move',
        zoomControlOptions: { position: google.maps.ControlPosition.LEFT_TOP}
    }
}

UserDataCollection.prototype.InitializeMap = function(mapId,successCallback,context) {

    this.GetMapOptions(function(options){

        this.map = new google.maps.Map(document.getElementById(mapId),options);

        successCallback.call(context,this.map);

    },this);
}

//Register Activity

UserDataCollection.prototype.RegisterActivity = function(activity,params) {

    params.activity = activity;

    $.ajax({

        url:rea_domain+'/leads/registeractivity',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error removing search: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}
