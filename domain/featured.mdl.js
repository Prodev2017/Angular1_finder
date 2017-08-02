function FeaturedCommunitiesCollection() {


}

FeaturedCommunitiesCollection.prototype.GetAllCommunities = function(successCallback,context) {

    $.ajax({

        url: rea_domain+'/featured/allcommunities',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (polys) {

            successCallback.call(context,polys);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting all community polygons: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function () {


        }
    });

    /*return [
        {
            communityId:1,
            name:'MetroTown',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,4hMISFgJBdZDE7-ILcjPcogmHNmWeCbXhWuG63wnH66UWmoBHp3LM2TfnUVgdpWKiKePQWlRy5QPbwHcc7Ybjy6Y7B8Zt2lfChk4KL2swL2VFXQPXSUtcRNj7-Cbd2ZC5m_lrTUlgDqnrFokqeIgpJxFhkvw1n3P-UjmLeqWSFy8iCCVQ2g-Nqh7flFPTmlt0987hWnxUrfN5SGe8r8LuxddYlmIFT7BGNAjtqD4HLBpGD1GI49MLXPUgG1tgI9mfZ91KfSinwsn7RNHYdGSvYYW28EZBg'
        },
        {
            communityId:2,
            name:'Buckingham Heights',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,rb4ogQd0lkOWijVHfHfcM66dsB6TqVZDzbr6fLYVr3n3RPr6rg3lRP45JzBCE2Vt9SBHptIZBh8vRMtD3i6ClV6QGqTvhURZQ-Q_lj-txdsqyGlDMY1B3CKU_X_vj69l8vmVjiDnHdOZnq0opm7gQ-Aphx8FvJSBOHUG'
        },
        {
            communityId:3,
            name:'Capitol Hill',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,d3SYHj31wx0I1khy3DrxQ7SbjsiYVmhf66bZQkrDUvJtthm7Qd9W4ROEt0qje42ar0521tW5uo-o1MxrcIwouHOlAU_s4D9XtlZbjecJZSd7Ziuue4rDhdr9L96KQ0FPHVrLnePycMvr1xj3ao_mx_xxlhp_jHrzcTFh'
        },
        {
            communityId:4,
            name:'Garden Village',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,6SJ7hgvqL6Eeeae4Q-Wo8_eKjjDFBBI73USkwj50MefG6TaTubm9VYCtuaWTYaAoGAQsAqzk9-Mp9FtiVDivEmekWGJT7CQHppnNLecAZEMx-5u1WzAoWSoZG2-riFzf8jKxjvPI5gFrX-6su3cqNBjsoEMXtNK7yIs0'
        },
        {
            communityId:5,
            name:'UniverCity',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,seDC39Xgt7a7SmhhlOri8ROIA_pcUeoSa9ZHR9mwagjt2mhIIvde06iH8ut--FPcgAWkFh4JjIcGEZUoPkg1jIcafOxGnOcz1nbwvoMXOMfyE_fsk3A6HnmcqrA-Fz6G3bAHZptDAHLBrHx-H2l58HaQO35wOtUbWIXf8DCG2qjYfPMxMQ'
        },
        {
            communityId:6,
            name:'Burnaby Heights',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,TKjy-KPZa6qgSnOV5UNpNoRCr6fxGX5Lf0znhLffKBRbidwoegXcxaXxqgC016FmzOcww7TQJAus9PzxxLvRgjdBMvEWrpxXNdOGBD4L9sUOAijb0kTTvG7-n_d5KvijU5pnol4NO6y3NtDljX6nz4pIX0SDVIGaiJVt'
        },
        {
            communityId:7,
            name:'Cascade Heights',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,mxFvzdztlBzizif_MekVLOFcXHa6KRDS88EJjC7EMqk89_lvJpeLFUQyNQM2PlPRRNj270LvIRZf0E-b8oc3uEsIcdtcLqFAkoh4aKHXUjU_u7Wi-e2EGFBR3_NdIRjtGYeT1MsUP8bwHcvzSanRdYVK1dZu4izK_sAa'
        },
        {
            communityId:8,
            name:'Westridge',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,wxNJgf8iwftSzd_Qe00N7aQIWsax1D6ncw_qRRMh9ZsdE3rVfr-jE78JgQw-CGugCkTUHrlaFtO7ZDIBnxXetTsdUfnaGGJQ0yeQ7te04yR8lhbGBoGSDWR7VSXESpo54PaNQE8xrbvC70wE8khFFiCHQb7onG13BKak'
        },
        {
            communityId:9,
            name:'',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,eDHUy0XahvngiOfn5YRREQgovYAxKQSXAEnYzywVqD8jgxDaZJLWxV02yDapJ_SfNRvpv2NY-OtGhC2dntzRVKakLAIxBl_AA71meZzBmLkqTq3gsMlQ7xbsnbjzdZJNCX4nXpgvWJguNepuuFATwAbSq7ihz9Le4Xq8'
        },
        {
            communityId:10,
            name:'South Slope',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,k_pRmLaDbVn3wDuXdclIQBb63WOIs4RtRK57Kb-vbL4Uc8MG5DI1OeWG6qlx0gUXSxG3EcH6epJOmKEJ70SEEDujuMDfCSfvdtwy0aLG7A8kxq5CD5Hp-aB3K8tD_X9LBVAvTt_UOJYrUmxXxJLEVGOZJqHAjNcyGjE3'
        },
        {
            communityId:11,
            name:'Eastburn',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,DxgBpVwppFKkak_e28cLGHYHgbsZ1ulrM8dxsgHiEH1wNrAmP1yBoI28_cYeUjSRfVzL51CnKzBfJaG871EH8fNyimWsp1NhO0a00cM0QuD1NAYPffDmHtzeE8wSflrjDwZ1z098ok5iz7mUHgVW2qbrMwSNwCkzupoG'
        },
        {
            communityId:12,
            name:'Sullivan Heights',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,EcOYEByj5ZrJ4SsovWaCmYlgtyuDnJ_q6oKsUGgbRAcljwntzv3sPwKHKL6LFP9hztPwiWa1cYixpfTHh1sBx91_YR9E3PyPS45BAULwwKTXyvk9fjnB0rIHIpjo2GNCGsV-PwDDmqJFzqB_yin_LcAtpIROncFId8b0'
        },
        {
            communityId:13,
            name:'Suncrest',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,3MSBsPmhPPD56BzD2hzjKuphq4Cx8354ecuszi4XOLz8yELZOBsvPuGdGQ_IlN_BKGBwBns2r8sF4FGuVUGnN4hRox5iMFZq04IM2--HbJJuWYiqikVo2pqedqvnQWGHKGpf1nA3tSbRlHD5jJ6ugzLthkze7iS8Wji6'
        },
        {
            communityId:14,
            name:'Willingdon Heights',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,r3Wz33jmYXpuIwTVHlS3o8VPP8axnan6F8GQ-CeD1bt0Dwxlj6hwOZ_S68A2e4crlMLbjjDg6u2Dm69H9uLsd3rDypm28sRWMlzymCWaTaEkKsKhje0G6G_eek67Pk7qAqVywk_Qp7KJZfMxyDpmJfu2ZBkQ8tf-hYTj'
        },
        {
            communityId:15,
            name:'Brentwood',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,QK_tNV5i8VazovHUqOV4zl1E_WgMURWraStXAc-Ik0rTMoOKdrxgEucnhtI3SuyPCjx44OEoivz3xlZJ_bxI47QMZf5Mi0xRhI3jfNXZtN4OyLlnIqieKSspTt9Y6EoG_u8CAZkgrhMX0HXn7vTXBKiH98C89xBhJu9k'
        },
        {
            communityId:16,
            name:'Middlgegate',
            city:'Burnaby',
            mainUrl:'https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzhdrDFhtmHhN1u-gM,G4VmXDk92GxDw1vbrF-VE-J26WBAf24g_qr58yPHMAE6rRaoJXqoQESn1PFbpXcmY8WEupZIHnMs1PwdZ7ksuIzQv6F6Hd9EyYhb84kmvSy_U4cJdyLp1xcnFRCruebWHS7B4tHU8gJwLhaPYpke72dBsEZK6C-s7ryG'
        }
    ]*/
}

function FeaturedPropertiesCollection() {


}

FeaturedPropertiesCollection.prototype.GetProperties = function() {

    return [

        {
            firstphotourl: 'https://ssl.cdn-redfin.com/system_files/media/17958_JPG/genLdpUgcMediaBrowserUrl/item_2.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'A13505',
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
            dom: 252,
            listingId: 262136589,
            remarksSummary:'This upgraded end unit Nothpark condo is move-in ready.Rich hardwood floors, fresh neutral paint, recessed lighting, crown molding and upgraded baseboards complement the bright and open floorplan. The inviting, second-level living room offers coffered ceilings, a cozy fireplace, a custom built-in media center and sliding doors to the spacious and private balcony. The living room flows to the attached dining room and to the kitchen. The kitchen is well-appointed with granite counters, stainless steel appliances and a breakfast bar.',
            agentComments:'This one may interest you',
            clientComments:'',
            latlng:{lat:33.736473, lng:-117.766886}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/system_files/media/30907_JPG/genLdpUgcMediaBrowserUrl/item_17.jpg',
            streetAddress:'14 Maribella Aisle',
            mlstable: 'REBGV_DRES',
            mlsnum: 'C35033',
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
            dom: 258,
            listingId: 262108146,
            remarksSummary:'Completely remodeled, this upstairs end-unit condo in the Westpark Tiempo community of Irvine is move-in ready. Rich wood laminate floors throughout, custom baseboards and door trims, vaulted and scraped ceilings and recessed lighting complement the bright and open floorplan. Enter into the inviting living room with a cozy gas fireplace. The living room flows to the dining room with a custom built-in work desk area with two desks which can also be used as a buffet area. The kitchen is well appointed with quartz counters and backsplash, new white shaker soft-close cabinets',
            agentComments:'',
            clientComments:'I like this one',
            latlng:{lat:33.684499,lng: -117.827606}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/system_files/media/32144_JPG/genLdpUgcMediaBrowserUrl/item_1.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'Q12505',
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
            dom: 251,
            listingId: 262153749,
            remarksSummary:'This formal model home is a buyer’s dream. This Largest backyard is an entertainer’s delight that has a decked out pavilion with BBQ area, T. V. , fridge, bar seating, Bocci ball court and citrus garden. This home that has no houses in front features plantation shutters, recessed lighting, epoxy floors in garage, sonos ready entertainment and extensive upgrades throughout that add to the elegance of the bright and open floor plan. Enter this upgraded home to extensive reclaimed woodwork on the ceiling, on into the well-appointed chef’s kitchen with solid counters, stainless steel appliances, a farmhouse sink, solid wood cabinets, and a large center island with bar seating',
            agentComments:'',
            clientComments:'',
            latlng:{lat:33.697246,lng: -117.729241}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/832/genMid.PW17068832_0.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'A53303',
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
            dom: 452,
            listingId: 262131605,
            remarksSummary:'Nestled in a charming tree-lined village of Northwood, this stylish corner townhome boasts a desirable private location with lush greenbelt views. Dramatic open layout with all living space on one level, and nobody above or below, makes a striking impression and offers designer upgrades that reveal pride of ownership and surpass every home in this price range. Inviting entry welcomes guests upstairs where soaring ceilings and walls of windows offer inspiring panoramic views and lots of natural light. Bright white kitchen features granite countertops overlooking casual dining and generous great room, offering stylish ambiance and comfortable living space.',
            agentComments:'',
            clientComments:'',
            latlng:{lat:33.699495,lng: -117.770452}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/545/genMid.OC17069545_0.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'B25955',
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
            dom: 638,
            listingId: 262152374,
            remarksSummary:'GORGEOUS. .Desirable SINGLE level home on greenbelt. Beautifully upgraded with quality upgrades. . As you enter you will be delighted with the dramatic features, large living room with vaulted ceilings & custom fireplace & stone tile floors. Separate formal dining room. 3 spacious bedrooms (one used as a den/office) 2 remodeled bathrooms. Romantic master suite with dual closets with organized. The bedrooms all have wood floors. All windows & sliding doors have been replaced with vinyl windows & sliders. Gourmet chefs kitchen, redone with granite counters, glass front on some doors, gas stove, large eat in nook & great light from the many windows',
            agentComments:'',
            clientComments:'',
            latlng:{lat:33.662881,lng: -117.801892}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/photo/58/mbpaddedwide/703/genMid.317002703_0.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'B33302',
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
            dom: 696,
            listingId: 262078195,
            remarksSummary:'Enjoy European Architecture, Fountains & Statues In Gated Community. Granite Entry Leads To Cozy Living Room W/ Fireplace. Dining Room & Kitchen Located On The Same Level. Den W/ Full Size Closet Could Be 2nd Br/Office/ Family Rm. Spacious Master Suite W/ Walk In Closet. Master Bath Includes Luxurious Roman Tub & Dual Vanities. Great Courtyard Location',
            agentComments:'',
            clientComments:'',
            latlng:{lat:33.687104,lng: -117.818839}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/892/genMid.OC17065892_0.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'A52205',
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
            dom: 989,
            listingId: 262168540,
            remarksSummary:'This is an immaculate light and bright detached home desirably located on a prime cul-de-sac in a hidden jewel-like location, in the gated Oak Creek! Enjoy a stress-free lifestyle by living within walking distance to shopping centers, restaurants, award-winning schools, swimming pools, tot lots, and more!5 minutes or less driving distance to hospitals, universities, and freeways. Enjoy a mini mansion with appealing curb, a covered porch that opens up to luxury living space. Offers 4 bedrooms, 3 baths, one loft, large master bedroom retreat, one bedroom and one shower bathroom on the main floor. Open floor plan invites sunshine and breeze to fill it while the fireplace centered in the living room for evening ambiance!New granite counter top installed in the kitchen with customized kitchen cabinetry, upgraded pantry, premium stainless steel appliances',
            agentComments:'',
            clientComments:'',
            latlng:{lat:33.665354,lng: -117.778654}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/840/genMid.OC17057840_0.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'C223505',
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
            dom: 287,
            listingId: 262113293,
            remarksSummary:'Beautiful Tustin Field Innovative Townhome with flexible floor plan is ready for its new owner! This interior location home is only attached on 1st level and features 4 bedrooms 4 Bathrooms ~ 1 Master Suite and 2 Junior Suites! Step inside to this beautiful upgraded home that invites you with a charming living room with a cozy fireplace. The open floor plan leads you to the Gourmet kitchen with Granite Counters, Gorgeous Backsplash, & Stainless Steel Appliances. The spacious dining area perfectly compliments the utility of the Kitchen layout. ',
            agentComments:'',
            clientComments:'',
            latlng:{lat:33.704689,lng: -117.802754}
        },
        {
            firstphotourl: 'https://ssl.cdn-redfin.com/photo/45/mbpaddedwide/809/genMid.OC17063809_0.jpg',
            mlstable: 'REBGV_DRES',
            mlsnum: 'A330324',
            streetAddress:'142 Church Pl',
            city:'Irvine',
            state:'CA',
            postalCode:'92602',
            listPrice:879000,
            propertyType:'Home',
            transactionType: 'For Sale',
            specialConditions:[],
            beds:4,
            baths:2.5,
            sqft:2000,
            lotsize:5500,
            yearBuilt:1998,
            hoaFees:0,
            dom: 789,
            listingId: 262113293,
            remarksSummary:'THIS HOUSE WON’T LAST! A huge private, water-conserving landscaped backyard is a rare find in Irvine. The front entry opens to a spacious Living, Dining and Kitchen area that provides a light and bright atmosphere. To the right of the entry is a den with double doors that can be used as a guest room or an office. Living room area has beautiful wood flooring with walls are tastefully painted with neutral colors, and the kitchen area is lined with tiled flooring for easy maintenance. The kitchen boasts of beautiful cabinetry and stainless steel appliances.',
            agentComments:'',
            clientComments:'',
            latlng:{lat:33.733788,lng: -117.773851}
        }
    ]
}
