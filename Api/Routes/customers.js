
'use strict';
let CustomersArr = require('../Customers.json');

const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');

const fs = require('fs');
    
//Get All Customers    
//https://localhost:443/customers
router.get('/',(req,res,next) => {   

    try
    {
        console.log('Invoke customers.. ');
        console.log('request cookie : ' + JSON.stringify(req.headers.cookie));      
    
        let CustomersArr = require('../Customers.json');
        console.log(CustomersArr);
     
        return res.status(200).json({
        Customers: CustomersArr        
        });      
        
    }
    catch (e) {
      console.log('Get customers error : ' + e);
    }
    
    
    });
    

//Get customer by id
// https://localhost:443/customers/customer/000000341
router.get('/customer/:id',(req,res,next) => { 
try
{
  let id = req.params.id;
  console.log('customer req.params.id: ' + req.params.id);  

  console.log('Invoke customer.. ');
  console.log('request cookie : ' + JSON.stringify(req.headers.cookie));

  let CustomersArr = require('../Customers.json');
  console.log(CustomersArr);
  
  var customer = CustomersArr.find(x => x.consentID === id);
 
  if (customer == undefined)
  {
    return res.status(200).json({
        Message: 'Data not found !'
  });   
 
  }


  return res.status(200).json({
          Customer: customer
  });   

}
catch (e) {
  console.log('Get customer error : ' + e);
}

});
  
//Add New Customer
//https://localhost:443/customers/NewCustomer
router.post('/NewCustomer',(req,res,next) => {
  
try 
{
    console.log('Invoke NewCustomer.. ');
    console.log('request cookie : ' + JSON.stringify(req.headers.cookie));
 
    let request = req.body;

    let CustomersArr = require('../Customers.json');

    var customer = CustomersArr.find(x => x.consentID === request.consentID);
 
    //validation - whean customer already exist
    if (customer != undefined)
    {
      res.status(200).json({ 
        message : 'Customer cannot be saved !'                  
    });    

    }

    CustomersArr.push(request);
    
    const path = require('path');
    fs.writeFileSync(path.resolve('./Api/', 'Customers.json'), JSON.stringify(CustomersArr));    
  
    res.status(200).json({ 
        message : 'New customer save successed !'                  
    });    
}
catch (e) {
  console.log('NewCustomer error : ' + e);
}

});

//Delete Customer By id
//https://localhost:443/customers/delete/1 
router.delete('/delete/:id',(req,res,next) => {
try
{
  console.log('Invoke delete.. ');
  console.log('request cookie : ' + JSON.stringify(req.headers.cookie));

  let id = req.params.id;
  console.log('req.params.id :' + req.params.id);
 
  let CustomersArr = require('../Customers.json');

  CustomersArr.splice(CustomersArr.findIndex(v => v.consentID === id), 1);

  const path = require('path');
  fs.writeFileSync(path.resolve('./Api/', 'Customers.json'), JSON.stringify(CustomersArr));    

  res.status(200).json({ 
    message : 'Delete customer successed !' ,
    consentID: req.params.id
  });    


}
catch (e) {
  console.log('Delete customer error : ' + e);
}

});

//Update customer permissions
//https://localhost:443/customers/update/1 
router.post('/update/:id',(req,res,next) => {  
try 
{
      console.log('Invoke update.. ');
      console.log('request cookie : ' + JSON.stringify(req.headers.cookie));

      let id = req.params.id;        
          
      let request = req.body;

      let CustomersArr = require('../Customers.json');
      console.log(CustomersArr);
      
      
      let customer = CustomersArr.find(x => x.consentID === id);

      console.log('Customer found for update ..' + JSON.stringify(customer));

      if (customer == undefined)
      {
         res.status(200).json({ 
          message : 'Data was not updated !'                  
         });    
      }
       //Update customer permissions
       for (var i = 0;i < request.accountPermissions;i++)
       {
          CustomersArr.find(x => x.consentID === id).accountPermissions.find(x => x.scope === request.accountPermissions[i].scope).accountStatus = request.accountPermissions[i].accountStatus;
       }
               
        const path = require('path');
        fs.writeFileSync(path.resolve('./Api/', 'Customers.json'),JSON.stringify(CustomersArr));// ??? JSON.stringify(CustomersArr));    

        res.status(200).json({ 
          message : 'Update customer permmisions successed !',
          consentID : id                
        });                
}
catch (e) 
{
    console.log('Update customer error : ' + e);
}              


});


module.exports = router;

