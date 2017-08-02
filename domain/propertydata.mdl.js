function PropertyDataCollection() {

    this.map =  null;

    this.currentView = 'maplist';

    this.currentSortOrder = 'listprice desc';

    this.currentPropertyTypes = "";

    this.currentAreaParams = {};

    this.currentFilterParams = {};

    this.initialControlValues = {};

    this.controls = {};

    //Begin Mock Data

    this.properties = [

        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_2.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'A13505',
            streetAddress:'249 Lockford',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92602',
            listPrice:675000,
            propertyType:'Condo',
            transactionType: 'For Rent',
            specialConditions:[],
            beds:3,
            baths:2,
            sqft:1892,
            lotSize:null,
            yearBuilt:2003,
            hoaFees:346,
            ppsqft:158,
            remarksSummary:'This upgraded end unit Nothpark condo is move-in ready.Rich hardwood floors, fresh neutral paint, recessed lighting, crown molding and upgraded baseboards complement the bright and open floorplan. The inviting, second-level living room offers coffered ceilings, a cozy fireplace, a custom built-in media center and sliding doors to the spacious and private balcony. The living room flows to the attached dining room and to the kitchen. The kitchen is well-appointed with granite counters, stainless steel appliances and a breakfast bar.',
            agentComments:'This one may interest you',
            clientComments:'',
            latlng:{lat:33.736473, lng:-117.766886},
            dom:12,
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/system_files/media/30907_JPG/genLdpUgcMediaBrowserUrl/item_17.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'C35033',
            streetAddress:'14 Maribella Aisle',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92614',
            listPrice:465000,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:[],
            beds:3,
            baths:2,
            sqft:1892,
            lotSize:null,
            yearBuilt:2003,
            hoaFees:346,
            ppsqft:310,
            remarksSummary:'Completely remodeled, this upstairs end-unit condo in the Westpark Tiempo community of Irvine is move-in ready. Rich wood laminate floors throughout, custom baseboards and door trims, vaulted and scraped ceilings and recessed lighting complement the bright and open floorplan. Enter into the inviting living room with a cozy gas fireplace. The living room flows to the dining room with a custom built-in work desk area with two desks which can also be used as a buffet area. The kitchen is well appointed with quartz counters and backsplash, new white shaker soft-close cabinets',
            agentComments:'',
            clientComments:'I like this one',
            dom:47,
            latlng:{lat:33.684499,lng: -117.827606},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/system_files/media/32144_JPG/genLdpUgcMediaBrowserUrl/item_1.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'Q12505',
            streetAddress:'195 Compass',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92618',
            listPrice:1295888,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:['OPEN Sat 1PM','Short Sale'],
            beds:3,
            baths:2.5,
            sqft:2194,
            lotSize:8046,
            yearBuilt:2013,
            hoaFees:173,
            ppsqft:288,
            remarksSummary:'This formal model home is a buyer’s dream. This Largest backyard is an entertainer’s delight that has a decked out pavilion with BBQ area, T. V. , fridge, bar seating, Bocci ball court and citrus garden. This home that has no houses in front features plantation shutters, recessed lighting, epoxy floors in garage, sonos ready entertainment and extensive upgrades throughout that add to the elegance of the bright and open floor plan. Enter this upgraded home to extensive reclaimed woodwork on the ceiling, on into the well-appointed chef’s kitchen with solid counters, stainless steel appliances, a farmhouse sink, solid wood cabinets, and a large center island with bar seating',
            agentComments:'',
            clientComments:'',
            dom:19,
            latlng:{lat:33.697246,lng: -117.729241},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/832/genMid.PW17068832_0.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'A53303',
            streetAddress:'6 Remington',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92620',
            listPrice:1295888,
            propertyType:'Condo',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 2PM'],
            beds:2,
            baths:2,
            sqft:955,
            lotSize:8046,
            yearBuilt:1986,
            hoaFees:293,
            ppsqft:175,
            remarksSummary:'Nestled in a charming tree-lined village of Northwood, this stylish corner townhome boasts a desirable private location with lush greenbelt views. Dramatic open layout with all living space on one level, and nobody above or below, makes a striking impression and offers designer upgrades that reveal pride of ownership and surpass every home in this price range. Inviting entry welcomes guests upstairs where soaring ceilings and walls of windows offer inspiring panoramic views and lots of natural light. Bright white kitchen features granite countertops overlooking casual dining and generous great room, offering stylish ambiance and comfortable living space.',
            agentComments:'',
            clientComments:'',
            dom:62,
            latlng:{lat:33.699495,lng: -117.770452},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/545/genMid.OC17069545_0.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'B25955',
            streetAddress:'17245 Citron',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92612',
            listPrice:750000,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 3PM'],
            beds:3,
            baths:2,
            sqft:1532,
            lotSize:4922,
            yearBuilt:1974,
            hoaFees:490,
            ppsqft:159,
            remarksSummary:'GORGEOUS. .Desirable SINGLE level home on greenbelt. Beautifully upgraded with quality upgrades. . As you enter you will be delighted with the dramatic features, large living room with vaulted ceilings & custom fireplace & stone tile floors. Separate formal dining room. 3 spacious bedrooms (one used as a den/office) 2 remodeled bathrooms. Romantic master suite with dual closets with organized. The bedrooms all have wood floors. All windows & sliding doors have been replaced with vinyl windows & sliders. Gourmet chefs kitchen, redone with granite counters, glass front on some doors, gas stove, large eat in nook & great light from the many windows',
            agentComments:'',
            clientComments:'',
            dom:121,
            latlng:{lat:33.662881,lng: -117.801892},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/58/mbpaddedwide/703/genMid.317002703_0.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'B33302',
            streetAddress:'9 Garzoni Aisle',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92606',
            listPrice:449950,
            propertyType:'Condo',
            transactionType: 'For Sale',
            specialConditions:['Short Sale'],
            beds:2,
            baths:1.5,
            sqft:1022,
            lotSize:null,
            yearBuilt:1992,
            hoaFees:364,
            ppsqft:210,
            remarksSummary:'Enjoy European Architecture, Fountains & Statues In Gated Community. Granite Entry Leads To Cozy Living Room W/ Fireplace. Dining Room & Kitchen Located On The Same Level. Den W/ Full Size Closet Could Be 2nd Br/Office/ Family Rm. Spacious Master Suite W/ Walk In Closet. Master Bath Includes Luxurious Roman Tub & Dual Vanities. Great Courtyard Location',
            agentComments:'',
            clientComments:'',
            dom:5,
            latlng:{lat:33.687104,lng: -117.818839},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/892/genMid.OC17065892_0.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'A52205',
            streetAddress:'45 Commonwealth',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92615',
            listPrice:1068980,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 1PM'],
            beds:4,
            baths:2.75,
            sqft:2363,
            lotSize:4305,
            yearBuilt:2000,
            hoaFees:149,
            remarksSummary:'This is an immaculate light and bright detached home desirably located on a prime cul-de-sac in a hidden jewel-like location, in the gated Oak Creek! Enjoy a stress-free lifestyle by living within walking distance to shopping centers, restaurants, award-winning schools, swimming pools, tot lots, and more!5 minutes or less driving distance to hospitals, universities, and freeways. Enjoy a mini mansion with appealing curb, a covered porch that opens up to luxury living space. Offers 4 bedrooms, 3 baths, one loft, large master bedroom retreat, one bedroom and one shower bathroom on the main floor. Open floor plan invites sunshine and breeze to fill it while the fireplace centered in the living room for evening ambiance!New granite counter top installed in the kitchen with customized kitchen cabinetry, upgraded pantry, premium stainless steel appliances',
            agentComments:'',
            clientComments:'',
            dom:16,
            latlng:{lat:33.665354,lng: -117.778654},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/840/genMid.OC17057840_0.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'C223505',
            streetAddress:'218 Landmark Lane',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92782',
            listPrice:688888,
            propertyType:'Condo',
            transactionType: 'For Sale',
            specialConditions:['OPEN SAT 5PM'],
            beds:4,
            baths:4,
            sqft:2213,
            lotSize:null,
            yearBuilt:2005,
            hoaFees:220,
            ppsqft:168,
            remarksSummary:'Beautiful Tustin Field Innovative Townhome with flexible floor plan is ready for its new owner! This interior location home is only attached on 1st level and features 4 bedrooms 4 Bathrooms ~ 1 Master Suite and 2 Junior Suites! Step inside to this beautiful upgraded home that invites you with a charming living room with a cozy fireplace. The open floor plan leads you to the Gourmet kitchen with Granite Counters, Gorgeous Backsplash, & Stainless Steel Appliances. The spacious dining area perfectly compliments the utility of the Kitchen layout. ',
            agentComments:'',
            clientComments:'',
            dom:14,
            latlng:{lat:33.704689,lng: -117.802754},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        },
        {
            savedPropertyId:0,
            firstPhotoUrl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/809/genMid.OC17063809_0.jpg',
            mlstable: 'REBGV_RES',
            mlsnum: 'A330324',
            streetAddress:'142 Church Pl',
            city:'Irvine',
            stateProvince:'CA',
            postalCode:'92602',
            listPrice:879000,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:[],
            beds:4,
            baths:2.5,
            sqft:2000,
            lotSize:5500,
            yearBuilt:1998,
            hoaFees:0,
            ppsqft:298,
            remarksSummary:'THIS HOUSE WON’T LAST! A huge private, water-conserving landscaped backyard is a rare find in Irvine. The front entry opens to a spacious Living, Dining and Kitchen area that provides a light and bright atmosphere. To the right of the entry is a den with double doors that can be used as a guest room or an office. Living room area has beautiful wood flooring with walls are tastefully painted with neutral colors, and the kitchen area is lined with tiled flooring for easy maintenance. The kitchen boasts of beautiful cabinetry and stainless steel appliances.',
            agentComments:'',
            clientComments:'',
            dom:22,
            latlng:{lat:33.733788,lng: -117.773851},
            agentInfo:{photoUrl:'https://www.redfin.com/stingray/agent/7906/photo/2',name:'Troy Hooper',listingAgent:false}
        }
    ]

    //End Mock Data

    this.AreaLookupRequest = null;

    this.ListingIDRequest = null;

    this.ListingCountRequest = null;

    this.MapClustersRequest = null;

    this.PropertiesRequest = null;

    this.PropertyDetailsRequest = null;

    this.PropertyGeneralDetailsRequest = null

    this.PropertyPhotosRequest = null;

    this.ListingLatLngRequest = null;
}

PropertyDataCollection.prototype.GetMapOptions = function(successCallback,context) {

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

PropertyDataCollection.prototype.InitializeMap = function(mapId,successCallback,context) {

    this.GetMapOptions(function(options){
		
        this.map = new google.maps.Map(document.getElementById(mapId),options);

        successCallback.call(context,this.map);

    },this);
}

PropertyDataCollection.prototype.SearchQuery = function() {

    var params = {};

    params.propertytypes = this.currentPropertyTypes;

    for(var aattrname in this.currentAreaParams)params[aattrname] = this.currentAreaParams[aattrname];

    for(var fattrname in this.currentFilterParams)params[fattrname] = this.currentFilterParams[fattrname];

    return params;
}

PropertyDataCollection.prototype.HasQuery = function() {

    if(this.currentAreaParams.bounds)return false;

    return !rea_util.IsEmptyObject(this.currentAreaParams)||!rea_util.IsEmptyObject(this.currentFilterParams);
}

PropertyDataCollection.prototype.GetSearchControls = function(successCallback,context) {

    this.controls = {};

    this.controls.minlistprice = [

        {name:'Any',value:''},
        {name:'$50k',value:'50000'},
        {name:'$100k',value:'100000'},
        {name:'$150k',value:'150000'},
        {name:'$200k',value:'200000'},
        {name:'$250k',value:'250000'},
        {name:'$300k',value:'300000'},
        {name:'$350k',value:'350000'},
        {name:'$400k',value:'400000'},
        {name:'$450k',value:'450000'},
        {name:'$500k',value:'500000'},
        {name:'$550k',value:'550000'},
        {name:'$600k',value:'600000'},
        {name:'$650k',value:'650000'},
        {name:'$700k',value:'700000'},
        {name:'$750k',value:'750000'},
        {name:'$800k',value:'800000'},
        {name:'$850k',value:'850000'},
        {name:'$900k',value:'900000'},
        {name:'$1m',value:'1000000'},
        {name:'$1.1m',value:'1100000'},
        {name:'$1.2m',value:'1200000'},
        {name:'$1.3m',value:'1300000'},
        {name:'$1.4m',value:'1400000'},
        {name:'$1.5m',value:'1500000'},
        {name:'$2m',value:'2000000'},
        {name:'$2.5m',value:'2500000'},
        {name:'$3m',value:'3000000'},
		{name:'$3.5m',value:'3500000'},
		{name:'$4m',value:'4000000'},
		{name:'$4.5m',value:'4500000'},
		{name:'$5m',value:'5000000'},
		{name:'$5.5m',value:'5500000'},
		{name:'$6m',value:'6000000'},
		{name:'$6.5m',value:'6500000'},
		{name:'$7m',value:'7000000'},
		{name:'$7.5m',value:'7500000'},
		{name:'$8m',value:'8000000'},
		{name:'$8.5m',value:'8500000'},
		{name:'$9m',value:'9000000'},
		{name:'$9.5m',value:'9500000'},
		{name:'$10m',value:'10000000'},
		{name:'$10.5m',value:'10500000'},
		{name:'$11m',value:'11000000'},
		{name:'11.5m',value:'11500000'},
		{name:'$12m',value:'12000000'},
		{name:'$12.5m',value:'12500000'},
		{name:'$13m',value:'13000000'},
		{name:'$13.5m',value:'13500000'},
		{name:'$14m',value:'14000000'},
		{name:'$14.5m',value:'14500000'},
		{name:'$15m',value:'15000000'},
    ];

    this.controls.maxlistprice = [

        {name:'Any',value:''},
        {name:'$50k',value:'50000'},
        {name:'$100k',value:'100000'},
        {name:'$150k',value:'150000'},
        {name:'$200k',value:'200000'},
        {name:'$250k',value:'250000'},
        {name:'$300k',value:'300000'},
        {name:'$350k',value:'350000'},
        {name:'$400k',value:'400000'},
        {name:'$450k',value:'450000'},
        {name:'$500k',value:'500000'},
        {name:'$550k',value:'550000'},
        {name:'$600k',value:'600000'},
        {name:'$650k',value:'650000'},
        {name:'$700k',value:'700000'},
        {name:'$750k',value:'750000'},
        {name:'$800k',value:'800000'},
        {name:'$850k',value:'850000'},
        {name:'$900k',value:'900000'},
        {name:'$1m',value:'1000000'},
        {name:'$1,1m',value:'1100000'},
        {name:'$1,2m',value:'1200000'},
        {name:'$1,3m',value:'1300000'},
        {name:'$1,4m',value:'1400000'},
        {name:'$1,5m',value:'1500000'},
        {name:'$2m',value:'2000000'},
        {name:'$2.5m',value:'2500000'},
        {name:'$3m',value:'3000000'},
		{name:'$3.5m',value:'3500000'},
		{name:'$4m',value:'4000000'},
		{name:'$4.5m',value:'4500000'},
		{name:'$5m',value:'5000000'},
		{name:'$5.5m',value:'5500000'},
		{name:'$6m',value:'6000000'},
		{name:'$6.5m',value:'6500000'},
		{name:'$7m',value:'7000000'},
		{name:'$7.5m',value:'7500000'},
		{name:'$8m',value:'8000000'},
		{name:'$8.5m',value:'8500000'},
		{name:'$9m',value:'9000000'},
		{name:'$9.5m',value:'9500000'},
		{name:'$10m',value:'10000000'},
		{name:'$10.5m',value:'10500000'},
		{name:'$11m',value:'11000000'},
		{name:'11.5m',value:'11500000'},
		{name:'$12m',value:'12000000'},
		{name:'$12.5m',value:'12500000'},
		{name:'$13m',value:'13000000'},
		{name:'$13.5m',value:'13500000'},
		{name:'$14m',value:'14000000'},
		{name:'$14.5m',value:'14500000'},
        {name:'$15m',value:'15000000'},
    ]

    this.controls.minbeds = [
        {name:'Any',value:''},
        {name:'1',value:'1'},
        {name:'2',value:'2'},
        {name:'3',value:'3'},
        {name:'4',value:'4'},
        {name:'5',value:'5'},
        {name:'6',value:'6'}
    ];

    this.controls.maxbeds = [
        {name:'Any',value:''},
        {name:'1',value:'1'},
        {name:'2',value:'2'},
        {name:'3',value:'3'},
        {name:'4',value:'4'},
        {name:'5',value:'5'},
        {name:'6',value:'6'}
    ];

    this.controls.minbaths = [
        {name:'Any',value:''},
        {name:'1',value:'1'},
        {name:'2',value:'2'},
        {name:'3',value:'3'},
        {name:'4',value:'4'},
        {name:'5',value:'5'},
        {name:'6',value:'6'}
    ];

    this.controls.maxbaths = [
        {name:'Any',value:''},
        {name:'1',value:'1'},
        {name:'2',value:'2'},
        {name:'3',value:'3'},
        {name:'4',value:'4'},
        {name:'5',value:'5'},
        {name:'6',value:'6'}
    ];

    this.controls.minsqft = [

        {name:'Any',value:''},
        {name:'350',value:'350'},
        {name:'500',value:'500'},
        {name:'1,000',value:'1000'},
        {name:'1,250',value:'1250'},
        {name:'1,500,',value:'1500'},
        {name:'1,750',value:'1750'},
        {name:'2,000',value:'2000'},
        {name:'2,250',value:'2250'},
        {name:'2,500',value:'2500'},
        {name:'2,750',value:'2750'},
        {name:'3,000',value:'3000'},
        {name:'3,250',value:'3250'},
        {name:'3,500',value:'3500'},
        {name:'3,750',value:'3750'},
        {name:'4,000',value:'4000'}
    ];

    this.controls.maxsqft = [

        {name:'Any',value:''},
        {name:'350',value:'350'},
        {name:'500',value:'500'},
        {name:'1,000',value:'1000'},
        {name:'1,250',value:'1250'},
        {name:'1,500,',value:'1500'},
        {name:'1,750',value:'1750'},
        {name:'2,000',value:'2000'},
        {name:'2,250',value:'2250'},
        {name:'2,500',value:'2500'},
        {name:'2,750',value:'2750'},
        {name:'3,000',value:'3000'},
        {name:'3,250',value:'3250'},
        {name:'3,500',value:'3500'},
        {name:'3,750',value:'3750'},
        {name:'4,000',value:'4000'}
    ];

    this.controls.minlotsize = [

        {name:'Any',value:''},
        {name:'2,000 SqFt',value:'2000'},
        {name:'4,000 SqFt',value:'4000'},
        {name:'8,000 SqFt',value:'8000'},
        {name:'10,000 SqFt',value:'10000'},
        {name:'.5 Acres',value:'21780'},
        {name:'1 Acre',value:'43560'},
        {name:'2 Acres',value:'87120'},
        {name:'3 Acres',value:'130680'},
        {name:'4 Acres',value:'174240'},
        {name:'5 Acres',value:'217800'},
        {name:'10 Acres',value:'435600'},
        {name:'20 Acres',value:'871200'},
        {name:'40 Acres',value:'1742000'}
    ];

    this.controls.maxlotsize = [

        {name:'Any',value:''},
        {name:'2,000 SqFt',value:'2000'},
        {name:'4,000 SqFt',value:'4000'},
        {name:'8,000 SqFt',value:'8000'},
        {name:'10,000 SqFt',value:'10000'},
        {name:'.5 Acres',value:'21780'},
        {name:'1 Acre',value:'43560'},
        {name:'2 Acres',value:'87120'},
        {name:'3 Acres',value:'130680'},
        {name:'4 Acres',value:'174240'},
        {name:'5 Acres',value:'217800'},
        {name:'10 Acres',value:'435600'},
        {name:'20 Acres',value:'871200'},
        {name:'40 Acres',value:'1742000'}
    ];

    this.controls.minyearbuilt = [

        {name:'Any',value:''},
        {name:'1900',value:'1900'},
        {name:'1910',value:'1910'},
        {name:'1920',value:'1920'},
        {name:'1930',value:'1930'},
        {name:'1940',value:'1940'},
        {name:'1950',value:'1950'},
        {name:'1960',value:'1960'},
        {name:'1970',value:'1970'},
        {name:'1980',value:'1980'},
        {name:'1990',value:'1990'},
        {name:'1995',value:'1995'},
        {name:'2000',value:'2000'},
        {name:'2005',value:'2005'},
        {name:'2010',value:'2010'},
        {name:'2015',value:'2015'},
        {name:'2016',value:'2016'},
        {name:'2017',value:'2017'},
    ];

    this.controls.maxyearbuilt = [

        {name:'Any',value:''},
        {name:'1900',value:'1900'},
        {name:'1910',value:'1910'},
        {name:'1920',value:'1920'},
        {name:'1930',value:'1930'},
        {name:'1940',value:'1940'},
        {name:'1950',value:'1950'},
        {name:'1960',value:'1960'},
        {name:'1970',value:'1970'},
        {name:'1980',value:'1980'},
        {name:'1990',value:'1990'},
        {name:'1995',value:'1995'},
        {name:'2000',value:'2000'},
        {name:'2005',value:'2005'},
        {name:'2010',value:'2010'},
        {name:'2015',value:'2015'},
        {name:'2016',value:'2016'},
        {name:'2017',value:'2017'}
    ];

    this.controls.maxhoa = [

        {name:'Any',value:''},
        {name:'$25 or Less',value:'25'},
        {name:'$50 or Less',value:'50'},
        {name:'$75 or Less',value:'75'},
        {name:'$100 or Less',value:'100'},
        {name:'$150 or Less',value:'150'},
        {name:'$200 or Less',value:'200'},
        {name:'$300 or Less',value:'300'},
        {name:'$400 or Less',value:'400'},
        {name:'$500 or Less',value:'500'},
        {name:'$600 or Less',value:'600'},
        {name:'$700 or Less',value:'700'},
        {name:'$800 or Less',value:'800'}
    ];

    this.controls.minparking = [

        {name:'Any',value:''},
        {name:'1 or More Spaces',value:'25'},
        {name:'2 or More Spaces',value:'50'},
        {name:'3 or More Spaces',value:'75'},
        {name:'4 or More Spaces',value:'100'},
        {name:'5 or More Spaces',value:'150'}
    ];

    this.controls.maxparking = [

        {name:'Any',value:''},
        {name:'1 or More Spaces',value:'25'},
        {name:'2 or More Spaces',value:'50'},
        {name:'3 or More Spaces',value:'75'},
        {name:'4 or More Spaces',value:'100'},
        {name:'5 or More Spaces',value:'150'}
    ];

    this.controls.pricereduced = [

        {name:'Any',value:''},
        {name:'Less Than 3 Days',value:'lt3'},
        {name:'Less Than 1 Week',value:'lt7'},
        {name:'Less Than 15 Days',value:'lt15'},
        {name:'Less Than One Month',value:'lt30'},

    ];

    this.controls.nextopenhouse = [

        {name:'Any',value:''},
        {name:'Today',value:'0'},
        {name:'Next 7 Days',value:'7'},
        {name:'Next Two Weeks',value:'14'},
        {name:'Next 30 Days',value:'30'},

    ];

    this.controls.dom = [

        {name:'Any',value:''},
        {name:'Less Than 3 Days',value:'lt3'},
        {name:'Less Than 1 Week',value:'lt7'},
        {name:'Less Than 15 Days',value:'lt15'},
        {name:'Less Than One Month',value:'lt30'},
        {name:'More Than One Week',value:'gt7'},
        {name:'More Than One Month',value:'gt30'},
        {name:'More Than Two Months',value:'gt60'},
        {name:'More Than Three Months',value:'gt90'},
        {name:'More Than Six Months',value:'gt120'}
    ];

    this.controls.propertytypes = [

        {name:'House',value:'house',selected:true},
        {name:'Condo',value:'condo',selected:true},
        {name:'Townhouse',value:'townhouse',selected:true},
        {name:'Multi-Family',value:'multifamily'},
        {name:'Land',value:'land'},
        {name:'Other',value:'other'}
    ];

    this.controls.specialconditions = [

        {name:'New Construction',value:'new'},
        {name:'Short Sale',value:'short'},
        {name:'Foreclosure',value:'foreclose'},
        {name:'Fixer Upper',value:'fixer'}
    ];

    this.initialControlValues = {};

    this.initialControlValues.minlistprice='';

    this.initialControlValues.maxlistprice='';

    this.initialControlValues.minbeds='';

    this.initialControlValues.maxbeds='';

    this.initialControlValues.minbaths='';

    this.initialControlValues.maxbaths='';

    this.initialControlValues.minsqft='';

    this.initialControlValues.maxsqft='';

    this.initialControlValues.minlotsize='';

    this.initialControlValues.maxlotsize='';

    this.initialControlValues.minyearbuilt='';

    this.initialControlValues.maxearbuilt='';

    this.initialControlValues.maxhoa='';

    this.initialControlValues.minparking='';

    this.initialControlValues.maxparking='';

    this.initialControlValues.pricedreduced='';

    this.initialControlValues.nextopenhouse='';

    this.initialControlValues.dom='';

    this.initialControlValues.propertytype = {};

    this.initialControlValues.propertytype.house = true;

    this.initialControlValues.propertytype.condo = true;

    this.initialControlValues.propertytype.townhouse = true;

    this.initialControlValues.propertytype.multifamily = false;

    this.initialControlValues.propertytype.land = false;

    this.initialControlValues.propertytype.other = false;

    successCallback.call(context,this.controls,this.initialControlValues);
}

PropertyDataCollection.prototype.LookupArea = function(lookupString,propertyTypes,successCallback,context) {

    if(this.AreaLookupRequest!=null) {

        this.AreaLookupRequest.abort();

        this.AreaLookupRequest = null;
    }

    var params = 'lookupstring='+lookupString;

    if(propertyTypes)params += '&propertytypes='+propertyTypes;

    var that = this;

    this.AreaLookupRequest = $.ajax({

        url:rea_domain+'/search/arealookahead',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error looking up area: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.AreaLookupRequest = null;
        }
    });
}

PropertyDataCollection.prototype.SetSearch = function(query) {
    console.log("in set search");
    var pquery = this.ParseSearch(query);

    this.currentPropertyTypes = pquery.propertytypes;

    this.currentAreaParams = pquery.area;

    if(!pquery.area.label) {

        if(pquery.area.city)pquery.area.label = pquery.area.city;
        else if(pquery.area.community)pquery.area.label = pquery.area.community;
    }

    this.currentFilterParams = pquery.filter;
}

PropertyDataCollection.prototype.UpdateSearchQuery = function(controlValues) {

    this.currentFilterParams = {};

    this.currentPropertyTypes = "house,condo,townhouse";

    var proptypelist = {};

    for (var criteria in controlValues) {

        if(controlValues[criteria]==null||controlValues[criteria]==''||controlValues[criteria]=='0')continue;

        if(criteria=='propertytype') {

            proptypelist = controlValues[criteria];

            continue;
        }

        var name = criteria;

        if(name.startsWith("min"))name = "min-"+rea_util.StringAfter(criteria,"min");

        if(name.startsWith("max"))name = "max-"+rea_util.StringAfter(criteria,"max");

        this.currentFilterParams[name]=controlValues[criteria];
    }

    var proptypes = [];

    for(var proptype in proptypelist) {

        if(proptypelist[proptype]==true)proptypes.push(proptype);
    }

    if(proptypes.length>0)this.currentPropertyTypes = proptypes.join(",");
}

PropertyDataCollection.prototype.ResetSearch = function() {

    // this.UpdateSearch(this.initialControlValues);

    return this.initialControlValues;
}

PropertyDataCollection.prototype.ParseSearch = function(query) {

    if (typeof query === 'string' || query instanceof String) {

        query = rea_util.QueryToObject(query);
    }

    var propertyTypes = '';

    var areaParams = {};

    var filterParams = {};

    var areaLabel = '';

    if(query.propertytypes!=null) {

        propertyTypes = query.propertytypes;

        delete query.propertytypes;
    }
    else {

        propertyTypes = 'house,condo,townhouse';
    }

    if(query.postalcode!=null) {

        areaParams.postalcode = query.postalcode.replace(/-/g, ' ');

        delete query.postalcode;

        areaLabel = areaParams.postalcode;
    }

    if(query.listingid!=null) {

        areaParams.listingid = query.listingid;

        delete query.listingid;

        areaLabel = areaParams.listingid;
    }

    if(query.address!=null) {

        areaParams.address = query.address.replace(/-/g, ' ');

        delete query.address;

        areaLabel = areaParams.address;
    }

    if(query.streetname!=null) {

        areaParams.streetname = query.streetname.replace(/-/g, ' ');

        delete query.streetname;

        areaLabel = areaParams.streetname;
    }

    if(query.city!=null) {

        areaParams.city = query.city.replace(/-/g, ' ');

        delete query.city;

        areaLabel = areaParams.city;
    }

    if(query.area!=null) {

        areaParams.area = query.area.replace(/-/g, ' ');

        delete query.area;

        areaLabel = areaParams.area;
    }

    if(query.subdivision!=null) {

        areaParams.subdivision = query.subdivision.replace(/-/g, ' ');

        delete query.subdivision;

        areaLabel = areaParams.subdivision;
    }

    if(query.community!=null) {

        areaParams.community = query.community.replace(/-/g, ' ');

        delete query.community;

        areaLabel = areaParams.community;
    }

    if(query.schooldistrict!=null) {

        areaParams.schooldistrict = query.schooldistrict.replace(/-/g, ' ');

        delete query.schooldistrict;

        areaLabel = areaParams.schooldistrict;
    }

    if(query.custom!=null) {

        areaParams.custom = query.custom;

        delete query.custom;

        areaLabel = 'Custom Area';
    }

    if(query.label!=null) {

        areaParams.label = query.label.replace(/-/g, ' ');

        delete query.label;
    }
    else areaParams.label = areaLabel;

    for (var attrname in query) { filterParams[attrname] = query[attrname]}

    return {propertytypes:propertyTypes,area:areaParams,filter:filterParams}
}

PropertyDataCollection.prototype.SetPropertyTypes = function(types) {

    this.currentPropertyTypes = types;
}

PropertyDataCollection.prototype.GetControlValues = function() {

    var controlValues = $.extend({},this.initialControlValues);

    for (var attrname in this.currentFilterParams) {

        var name = attrname;

        if(name.startsWith('max-')) {

            name = 'max'+rea_util.StringAfter(name,'max-');
        }
        else if(name.startsWith('min-')) {

            name = 'min'+rea_util.StringAfter(name,'min-');
        }

        controlValues[name] = this.currentFilterParams[attrname].toString();
     }

    var props = {};

    var proptypes = this.currentPropertyTypes.split(',');

    for(var i=0;i<proptypes.length;i++)props[proptypes[i]]= true;

    for (var attrname in controlValues.propertytype) {

        if(props[attrname])controlValues.propertytype[attrname] = true;
        else controlValues.propertytype[attrname] = false;
    }

    return controlValues;
}

PropertyDataCollection.prototype.GetListingIDs = function(query,propertyTypes,sortOrder,successCallback,context) {

    if(this.ListingIDRequest!=null) {

        this.ListingIDRequest.abort();

        this.ListingIDRequest = null;
    }

    query.fields = "listingid";

    query.propertytypes = propertyTypes;

    query.sort = sortOrder;

    var that = this;

    this.ListingIDRequest = $.ajax({

        url:rea_domain+'/search/listings',
        cache: false,
        data: query,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error retrieving listingids: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.ListingIDRequest = null;
        }
    });
}

PropertyDataCollection.prototype.GetListingCount = function(query,propertyTypes,successCallback,context) {

    if(this.ListingCountRequest!=null) {

        this.ListingCountRequest.abort();

        this.ListingCountRequest = null;
    }

    query.propertytypes = propertyTypes;

    var that = this;

    this.ListingCountRequest = $.ajax({

        url:rea_domain+'/search/listingscount',
        cache: false,
        data: query,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error retrieving listingids: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.ListingIDRequest = null;
        }
    });
}

PropertyDataCollection.prototype.GetMapClusters = function(query,propertyTypes,zoom,updatePolys,successCallback,context) {

    if(this.MapClustersRequest!=null) {

        this.MapClustersRequest.abort();

        this.MapClustersRequest = null;
    }

    var mquery = query;

    mquery.propertytypes = propertyTypes;

    mquery.zoom = zoom;

    mquery.gridsize = 175;

    if(updatePolys)mquery.returnpolys=1;

    var that = this;

    this.MapClustersRequest = $.ajax({

        url:rea_domain+'/search/maplistings',
        cache: false,
        data: mquery,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            successCallback.call(context,response,updatePolys);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting map clusters: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.MapClustersRequest = null;
        }
    });
}

PropertyDataCollection.prototype.GetListings = function(query,successCallback,context) {

    if(this.PropertiesRequest!=null) {

        this.PropertiesRequest.abort();

        this.PropertiesRequest = null;
    }

    var that = this;

    this.PropertiesRequest = $.ajax({

        url:rea_domain+'/search/listings',
        cache: false,
        data: query,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting list properties: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.PropertiesRequest = null;
        }
    });

    //return this.properties;
}

PropertyDataCollection.prototype.GetListingLatLng = function(idxtable,listingid,successCallBack,context) {

    if(this.ListingLatLngRequest!=null) {

        this.ListingLatLngRequest.abort();

        this.ListingLatLngRequest = null;
    }

    this.ListingLatLngRequest = $.ajax({

        url:rea_domain+'/search/listinglatlng',
        cache: false,
        data: "idxtable="+idxtable+"&listingid="+listingid,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallBack.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting listing lat lng: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.ListingLatLngRequest = null;
        }
    });
}

PropertyDataCollection.prototype.GetListingFullDetails = function(idxtable,listingid,successCallback,context) {

    if(this.PropertyDetailsRequest!=null) {

        this.PropertyDetailsRequest.abort();

        this.PropertyDetailsRequest = null;
    }

    var that = this;
    var _data = idxtable ? "idxtable="+idxtable+"&listingid="+listingid : "listingid="+listingid;
    this.PropertyDetailsRequest = $.ajax({

        url:rea_domain+'/search/fulllistingdetails',
        cache: false,
        data: _data,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting listing details: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.PropertyDetailsRequest = null;
        }
    });

   /* for(var i=0;i<this.properties.length;i++) {

        var property = this.properties[i];

        if(property.mlstable==mlstable&&property.mlsnum==mlsnum) {

            property.photos =  [
                {id:0,url:property.firstPhotoUrl},
                {id:1,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_2.jpg'},
                {id:2,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_1.jpg'},
                {id:3,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_3.jpg'},
                {id:4,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_16.jpg'},
                {id:5,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_19.jpg'},
                {id:6,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_21.jpg'},
                {id:7,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_15.jpg'},
                {id:8,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_14.jpg'},
                {id:9,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_17.jpg'},
                {id:10,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_12.jpg'},
                {id:11,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_13.jpg'},
                {id:12,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_7.jpg'},
                {id:13,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_4.jpg'},
                {id:14,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_20.jpg'},
                {id:15,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_41.jpg'},
                {id:16,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_27.jpg'},
                {id:17,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_34.jpg'}
            ];

            return property;
        }
    }*/

    return {};
}

PropertyDataCollection.prototype.GetListingGeneralDetails = function(idxtable,listingid,successCallback,context) {

    if (this.PropertyGeneralDetailsRequest != null) {

        this.PropertyGeneralDetailsRequest.abort();

        this.PropertyGeneralDetailsRequest = null;
    }

    var that = this;

    this.PropertyGeneralDetailsRequest = $.ajax({

        url: rea_domain+'/search/generallistingdetails',
        cache: false,
        data: "idxtable=" + idxtable + "&listingid=" + listingid,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallback.call(context, response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting listing general details: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function () {

            that.PropertyGeneralDetailsRequest = null;
        }
    });
}

PropertyDataCollection.prototype.GetPhotos = function(idxtable,listingid,successCallback,context) {

    if(this.PropertyPhotosRequest!=null) {

        this.PropertyPhotosRequest.abort();

        this.PropertyPhotosRequest = null;
    }

    this.PropertyPhotosRequest = $.ajax({

        url:rea_domain+'/search/photourls',
        cache: false,
        data: "idxtable="+idxtable+"&listingid="+listingid,
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting property photos: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.PropertyPhotosRequest = null;
        }
    });

   /* for(var i=0;i<this.properties.length;i++) {

        var property = this.properties[i];

        if(property.mlstable==mlstable&&property.mlsnum==mlsnum) {

            var photos =  [
                {id:0,url:property.firstPhotoUrl},
                {id:1,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_2.jpg'},
                {id:2,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_1.jpg'},
                {id:3,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_3.jpg'},
                {id:4,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_16.jpg'},
                {id:5,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_19.jpg'},
                {id:6,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_21.jpg'},
                {id:7,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_15.jpg'},
                {id:8,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_14.jpg'},
                {id:9,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_17.jpg'},
                {id:10,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_12.jpg'},
                {id:11,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_13.jpg'},
                {id:12,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_7.jpg'},
                {id:13,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_4.jpg'},
                {id:14,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_20.jpg'},
                {id:15,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_41.jpg'},
                {id:16,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_27.jpg'},
                {id:17,url:'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_34.jpg'}

            ];

            return photos;
        }
    }*/

    return {};
}

