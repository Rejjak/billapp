const { app } = require('electron');
const path = require('path');
const userAppDataDir = app.getPath('userData');
const dbFilePath = path.join(userAppDataDir,'db.sqlite');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbFilePath,
  },
  pool: {
    min: 2,
    max: 10
},
  useNullAsDefault: true
})

knex.schema.hasTable('products').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('products', (table)  => {
          table.increments('id').primary()
          table.string('name')
          table.string('type')
          table.string('brand')
          table.string('model')
          table.integer('stock')
          table.integer('price')
          table.integer('sp_price')
          table.integer('added_on')
        })
        .then(() => {
            // Log success message
            console.log('Table \'products\' created')
        })
        .catch((error) => {
            console.error(`There was an error creating table: ${error}`)
        })
    }
}).then(() => {
    // Log success message
    console.log('done')
}).catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
})

knex.schema.hasTable('brands').then((exists) => {
  if (!exists) {
      return knex.schema.createTable('brands', (table)  => {
        table.increments('id').primary()
        table.integer('name')
        table.string('image')
        table.integer('added_on')
      })
      .then(() => {
          console.log('Table \'brands\' created')
      })
      .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
      })
  }
}).then(() => {
  console.log('done brands')
}).catch((error) => {
  console.error(`There was an error setting up the database: ${error}`)
})

knex.schema.hasTable('prd_types').then((exists) => {
  if (!exists) {
      return knex.schema.createTable('prd_types', (table)  => {
        table.increments('id').primary()
        table.integer('name')
        table.string('image')
        table.integer('added_on')
      })
      .then(() => {
          console.log('Table \'prd_types\' created')
      })
      .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
      })
  }
}).then(() => {
  console.log('done prd_types')
}).catch((error) => {
  console.error(`There was an error setting up the database: ${error}`)
})

knex.schema.hasTable('sales_history').then((exists) => {
  if (!exists) {
      return knex.schema.createTable('sales_history', (table)  => {
        table.increments('id').primary()
        table.text('items')
        table.text('bag_extra')
        table.text('total_amount')
        table.integer('added_on')
      }).then(() => {
          // Log success message
          console.log('Table \'sales_history\' created')
      })
      .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
      })
  }
}).then(() => {
  // table modified code, use this way if needed

  // knex.schema.hasColumn('sales_history','total_amountd').then((res)=>{
  //   if(!res){
  //     knex.schema.alterTable('sales_history',(table)=>{
  //       table.text('total_amount').alter()
  //     }).then(() => {
  //       console.log('Table \'sales_history\' modified')
  //     }).catch((error) => {}).then(() => {}).catch((error) => {})
  //   }
  // })

}).catch((error) => {
  console.error(`There was an error setting up the database: ${error}`)
})

knex.schema.hasTable('app_setting').then((exists) => {
  if (!exists) {
      return knex.schema.createTable('app_setting', (table)  => {
        table.increments('id').primary()
        table.string('com_name')
        table.string('com_add_one')
        table.string('com_add_two')
        table.string('com_add_three')
        table.integer('com_status')
        table.string('own_name')
        table.string('own_dp')
        table.string('own_email')
        table.string('own_wp')
        table.integer('own_status')
        table.string('password')
        table.string('pass_hint')
        table.integer('pass_created')
        table.integer('inv_default_no')
        table.integer('inv_watermark')
        table.integer('inv_footer_pos')
        table.integer('inv_dev_name')
        table.integer('cust_type')
        table.integer('prd_list')
        table.integer('bag_tax')
        table.integer('bag_discount')
        table.string('app_activate_key')
        table.integer('app_activate_time')
      })
      .then(() => {
          console.log('Table \'app_setting\' created')
          knex('app_setting').insert({
            com_name : '',
            com_add_one:'',
            com_add_two:'',
            com_add_three:'',
            com_status:0,
            own_name:'',
            own_dp:'',
            own_email:'',
            own_wp:'',
            own_status:0,
            password:'12345',
            pass_hint:'12345',
            pass_created:0,
            inv_default_no:100,
            inv_watermark:1,
            inv_footer_pos:1,
            inv_dev_name:1,
            cust_type:1,
            prd_list:1,
            bag_tax:1,
            bag_discount:1,
            app_activate_key:'',
            app_activate_time : new Date()
        }).then(() => {
           console.log('default value inserted');
        }).catch(err => {
            console.log(err);
        })
      })
      .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
      })
  }
}).then(() => {
  console.log('done app_setting')
  // table modified code, use this way if needed
  // to add new coulmn use table.integer('pass_created')
  // to modify the data type use tablee.integer('pass_created').alter()
}).catch((error) => {
  console.error(`There was an error setting up the database: ${error}`)
})

module.exports = knex