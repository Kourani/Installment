'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// const {Sequelize} = require("sequelize")

const {User, Spot} = require('../models')


const userSpots = [

  {
    firstName: 'Lost',
    lastName: 'Avenger',

    spots:[

    {
      address:"123 Disney Lane",
      city:"Tusayan",
      state:'Arizona',
      lat: 37.7645358,
      lng: -122.4730327,
      country:"United States of America",
      name:"Ford Mustang",
      description:"The legendary Ford Mustang, an automotive icon, continues to captivate hearts with its timeless design and exhilarating performance. As a symbol of American muscle and style, the 2021 Ford Mustang evokes a sense of excitement and nostalgia for enthusiasts and casual drivers alike. Under the hood, a range of powerful engines delivers a thrilling driving experience, from the spirited EcoBoost models to the roaring V8-powered GT variants. The Mustang's finely tuned chassis and suspension ensure responsive handling and precise control, making every twist and turn on the road an adventure. Step inside, and you'll be greeted by a driver-focused cockpit, blending modern technology with classic styling cues. The 2021 Ford Mustang remains a true automotive legend, embodying the spirit of freedom, power, and a passion for the open road.",
      price:32000},

      {
        address:"123 Private Drive",
        city:"Tusayan",
        state:'Arizona',
        lat: 37.7645358,
        lng: -122.4730327,
        country:"United States of America",
        name:"Ford Mustang Mach E",
        description:"Revolutionizing the automotive landscape, the 2021 Ford Mustang Mach-E sets a new standard for all-electric SUVs. This cutting-edge marvel strikes the perfect balance between power and eco-consciousness, boasting an impressive range of up to 300 miles on a single charge, depending on the chosen battery pack and configuration. Buckle up for an adrenaline-fueled ride as the Mustang Mach-E's electric powertrain accelerates from 0 to 60 mph in just 3.5 seconds with its top-performing GT variant. Equipped with a 15.5-inch touchscreen infotainment system and over-the-air software updates, this ride is tech-savvy and future-proof. Its alluring design incorporates iconic Mustang-inspired elements, while the spacious interior caters to five passengers and offers abundant cargo space. Safety takes center stage with Ford Co-Pilot360 technology, featuring pre-collision assist and intelligent adaptive cruise control.",
        price:42895},
  ]
  },

{
  firstName: 'Born',
  lastName:'Avenger',

  spots:[{
  address:"123 Disney Lane",
  city:'New York',
  state:'New York',
  country:"United States of America",
  lat:564.65,
  lng:432.45,
  name:"Maserati Quattroporte",
  description:"As the flagship luxury sedan, the 2021 Maserati Quattroporte commands attention with its regal presence and high-performance capabilities. This Italian masterpiece artfully balances power and grace, offering a choice of twin-turbo V6 or V8 engines to suit every preference. Inside, the handcrafted interior envelopes occupants in lavish comfort, boasting meticulous attention to detail and the latest infotainment technology. Whether in the driver's seat or being chauffeured in the back, the Maserati Quattroporte promises a luxurious and unforgettable journey.",
  price:100000},

  {
    address:"123 Disney Lane",
    city:'New York',
    state:'New York',
    country:"United States of America",
    lat:564.65,
    lng:432.45,
    name:"Maserati Levante",
    description:"Elevating the SUV experience, the 2021 Maserati Levante exudes the brand's distinctive Italian flair while providing versatility and ruggedness. With its bold lines and aggressive stance, the Levante commands the road with an air of authority. Beneath the hood lies a range of powerful engines, ensuring a spirited drive no matter the terrain. The luxurious interior is adorned with premium materials and modern technology, creating a serene and comfortable environment for all passengers. The Maserati Levante effortlessly blends the practicality of an SUV with the allure and performance of a true Italian sports car.",
    price:75000},

    {
      address:"123 Disney Lane",
      city:'New York',
      state:'New York',
      country:"United States of America",
      lat:564.65,
      lng:432.45,
      name:"Maserati GranTurismo",
      description:" A captivating grand touring coupe, the 2021 Maserati GranTurismo, epitomizes the essence of Italian automotive excellence. Its striking design exudes timeless elegance, while its roaring V8 engine delivers a symphony of power and performance. Slip into the driver-focused cockpit, and you'll be greeted by a wealth of opulent materials and advanced technology, making every journey a true celebration of the open road. The Maserati GranTurismo stands as a testament to the art of grand touring, offering a harmonious blend of style, performance, and luxury.",
      price:100000
    },

      {
        address:"123 Disney Lane",
        city:'New York',
        state:'New York',
        country:"United States of America",
        lat:564.65,
        lng:432.45,
        name:"Maserati GranCabrio",
       description:"Embrace the thrill of open-top driving with the 2021 Maserati GranCabrio, the convertible version of the iconic GranTurismo. This stunning grand tourer lets you savor the wind in your hair while experiencing the exhilarating power of its V8 engine. Inside the opulent cabin, premium craftsmanship and modern technology create a refined space for driver and passengers alike. With its breathtaking design and top-down motoring, the Maserati GranCabrio invites you to indulge in the romance of a true Italian convertible.",
       price:75000},



]

},

{
  firstName:'Avenged',
  lastName:'Avenger',

  spots:[{
  address:"123 Disney Lane",
  city:'Orlando',
  state:'Florida',
  country:"United States of America",
  lat:564.01,
  lng:432.22,
  name:"McLaren 720S Coupe",
  description: "As a masterpiece of automotive art, the McLaren 720S Coupe unleashes unparalleled performance with an unmistakably striking design. This mid-engine supercar conquers the asphalt with a twin-turbocharged V8 engine, rocketing from 0 to 60 mph in just 2.9 seconds. Its sleek and aerodynamic body lines not only turn heads but also enhance aerodynamic efficiency. Step inside the luxurious cabin, where opulence meets technology, offering a seamless blend of driver-focused controls and premium materials, creating an unforgettable driving experience that's second to none.",
  price:299000},

  {
    address:"123 Disney Lane",
    city:'Miami',
    state:'Florida',
    country:"United States of America",
    lat:564.01,
    lng:432.22,
    name:"McLaren 720S Spider",
    description:"Elevating open-top driving to new heights, the McLaren 720S Spider combines blistering performance with the exhilarating sensation of wind in your hair. With the same awe-inspiring powertrain as the coupe, this convertible supercar delivers hair-raising acceleration and dynamic handling. The retractable hardtop disappears in seconds, transforming the car from a refined coupe to an open-air supercar, showcasing the perfect fusion of elegance and adrenaline-inducing prowess.",
    price:315000},

    {
      address:"123 Disney Lane",
      city:'Panama City',
      state:'Florida',
      country:"United States of America",
      lat:564.01,
      lng:432.22,
      name:"McLaren 765LT",
      description:"The McLaren 765LT, the Longtail successor, pushes the limits of performance even further. Lighter, more powerful, and track-focused, it embodies the spirit of racing. Its twin-turbocharged V8 engine produces a staggering 755 horsepower, resulting in mind-bending acceleration. The 765LT's aerodynamic enhancements provide unrivaled downforce, ensuring razor-sharp cornering and on-track dominance. Embracing the spirit of motorsport, this limited-production masterpiece offers an exclusive and spine-tingling driving experience.",
      price:358000},

      {
        address:"123 Disney Lane",
        city:'Gainesville',
        state:'Florida',
        country:"United States of America",
        lat:564.01,
        lng:432.22,
        name:"McLaren GT",
        description:"Redefining the grand tourer, the McLaren GT combines supercar performance with grand touring comfort. This unique blend ensures you can cover long distances in utmost luxury while maintaining the electrifying driving experience McLaren is renowned for. The twin-turbo V8 engine effortlessly powers this GT, delivering an invigorating 0-60 mph sprint in just over three seconds. The beautifully crafted interior exudes opulence, adorned with the finest materials, making every journey an unforgettable adventure.",
        price:210000},

        {
          address:"123 Disney Lane",
          city:'Gainesville',
          state:'Florida',
          country:"United States of America",
          lat:564.01,
          lng:432.22,
          name:'McLaren Artura',
          description:"As a revolutionary hybrid supercar, the McLaren Artura introduces a new era of high-performance motoring. Fusing a twin-turbocharged V6 engine with an electric motor, this masterpiece provides a perfect balance of electrifying power and remarkable efficiency. Rapid acceleration and instantaneous torque are the hallmarks of the Artura, offering an eco-conscious driving experience without compromising the heart-pounding excitement. The state-of-the-art design, cutting-edge technology, and driver-focused interior make the Artura a vision of the future, where performance and sustainability harmoniously coexist.",
          price:225000}

  ]},

{
  firstName:'Unknown',
  lastName:'Avenger',

  spots:[{
  address:"123 Disney Lane",
  city:'Crystal River',
  state:'Florida',
  country:"United States of America",
  lat:564.01,
  lng:432.22,
  name:'Maserati Ghibli',
  description:"Embodying Italian elegance and performance, the 2021 Maserati Ghibli stands as a captivating luxury mid-size sedan. Its sleek lines and aggressive front grille exude an air of sophistication, while the powerful engine options, including a twin-turbo V6, deliver a thrilling driving experience. Step inside the refined cabin adorned with premium materials and cutting-edge technology, and you'll find yourself surrounded by luxury at every turn. The Maserati Ghibli seamlessly blends style, comfort, and sportiness, making it an ideal choice for discerning drivers seeking a unique and exhilarating ride.",
  price:75000}]
},
]

module.exports = {
  async up (queryInterface, Sequelize) {

    for(let userIdx =0; userIdx < userSpots.length; userIdx++){
      const {firstName, lastName, spots} = userSpots[userIdx]
      const user = await User.findOne({
        where:{firstName, lastName}
      })

      for(let spotIdx = 0; spotIdx < spots.length; spotIdx++ ){
        const spot = spots[spotIdx]
        await Spot.create({...spot, ownerId: user.id})
      }
    }

  },

  async down (queryInterface, Sequelize) {
    for(let userIdx =0; userIdx < userSpots.length; userIdx++){
      const {firstName, lastName, spots} = userSpots[userIdx]
      const user = await User.findOne({
        where:{firstName, lastName}
      })

      for(let spotIdx = 0; spotIdx < spots.length; spotIdx++ ){
        const spot = spots[spotIdx]
        await Spot.create({...spot, ownerId: user.id})
      }
    }
  }
}
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */

//     options.tableName = 'Spots';
//     return queryInterface.bulkInsert(options, [
//     {
//       address:'afhskafh',
//       city:'dear',
//       state:'mich',
//       latitude:564.45,
//       longitude:432.32,
//       country:'aaa',
//       name:'last',
//       description:'fjsakfhjhe',
//       price:5121.12
//     },
//     {
//       address:'afhskafh',
//       city:'dear',
//       state:'mich',
//       country:'aaa',
//       latitude:564.65,
//       longitude:432.45,
//       name:'last',
//       description:'fjsakfhjhe',
//       price:5121.1
//     },
//     {
//       address:'afhskafh',
//       city:'dear',
//       state:'mich',
//       country:'aaa',
//       latitude:564.01,
//       longitude:432.22,
//       name:'last',
//       description:'fjsakfhjhe',
//       price:5121.12
//     },


//   ], {});
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */


//   options.tableName = 'Spots';
//   const Op = Sequelize.Op;
//   return queryInterface.bulkDelete(options);
//   }

// };
