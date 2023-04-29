'use strict';


const {Model} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Spot.belongsTo(
        models.User,
        {foreignKey:'userId'}
      ),

      Spot.hasMany(
        models.Booking,
        {foreignKey:'spotId'}
      ),

      Spot.hasMany(
        models.Review,
        {foreignKey:'spotId'}
      ),

      Spot.hasMany(
        models.Image,
        {foreignKey:'imagableId',
         constraints:false,
        scope:{
          imagableType:'Spot'
        }}

      )
    }
  }
  Spot.init({

    address:{
      type:DataTypes.STRING,
      allowNull:false,
      // validate:{
      //   isAlphanumeric: true
      // }

    },

    city:{
      type:DataTypes.STRING,
      allowNull:false,
      // validate:{
      //   isAlpha: true,
      //   }
      },

    state:{
      type:DataTypes.STRING,
      allowNull:false,
      // validate:{
      //   isAlpha: true
      // }
    },

    country:{
      type:DataTypes.STRING,
      allowNull:false,
      // validate:{
      //   isAlpha: true
      // }
    },

    lat:{
      type:DataTypes.DECIMAL,
      allowNull:false
    },

    lng:{
      type:DataTypes.DECIMAL,
      allowNull:false,
      // validate:{
      //   isNumeric:true
      // }
    },

    name:{
      type:DataTypes.STRING,
      allowNull:false,
      // validate:{
      //   isAlpha: true
      // }
    },

    description:{
      type:DataTypes.STRING,
      allowNull:false,
    },

    price:{
      type:DataTypes.DECIMAL,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
