import db from './firbase';
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

const checkData = (data)=> {
    if(data != null){
        let fireBaseTime = new Date(
            data.reg_date.seconds * 1000 + data.reg_date.nanoseconds / 1000000,
        );
        let date1 = new Date(fireBaseTime);
        let date2 = new Date();
        let Difference_In_Time = date2.getTime() - date1.getTime(); 
        let day_diff = (Difference_In_Time / (1000 * 3600 * 24));
        let numberOfDaysLeft = ~~(data.no_of_days - day_diff);
        let title = '';
        let message = '';
        let renewRequired = false;
        let color = '#111';
        let licence_no = data.licence_no;
        console.log(numberOfDaysLeft);
        let showAlert = false;
        if(numberOfDaysLeft <= 0){
            renewRequired = true;
            showAlert = true;
            color = 'red';
            title = 'Licence Expired';
            message = 'Your license has expired, please contact the developer for renewal.';
        }else if(numberOfDaysLeft > 0 && numberOfDaysLeft < 16){
            renewRequired = true;
            showAlert = false;
            color = 'orange';
            title = `Expiration in ${numberOfDaysLeft} days`;
            message = 'Your license is about to expire, please contact the developer for renewal.';
        }else{
            title = 'Application Activated';
            message = 'Your application has been activated, enjoy the unlimited features it offers!';
        }

        return {
            status:true,
            data:data,
            renewRequired:renewRequired,
            showAlert:showAlert,
            color :color,
            licence_no :licence_no,
            alertMsg:{
                title : title,
                message : message
            }
        }
        
    }else{
        return {
            status:true,
            data:null,
            renewRequired:false,
            showAlert:true,
            color : null,
            licence_no : '',
            alertMsg:{
                title : 'Application not activated',
                message : 'Your application is not activated, activate your application to use unlimited features.'
            }
        }
    }
}
class FireStoreService{
    checkLicence(mac_add){
        console.log(mac_add);
        return new Promise(async(resolve) => {
            try{
                const snapshot = await getDoc(doc(db, "customers",mac_add));
                const data = snapshot.exists() ? snapshot.data() : null;
                if(data != null){
                    localStorage.setItem("customer_data", JSON.stringify(data));
                }
                console.log(data,'firbase result');
                resolve(checkData(data));
            }catch(err){
                console.log(err);
                let local_customer = localStorage.getItem("customer_data");
                let local_data = local_customer != null ? JSON.parse(local_customer) : null;
                console.log(local_data,'local result');
                if(local_data != null){
                    resolve(checkData(local_data));
                }else{
                    resolve({
                        status:true,
                        data:null,
                        renewRequired:false,
                        showAlert:true,
                        color : null,
                        alertMsg:{
                            title : 'Application not activated',
                            message : 'Your application is not activated, activate your application to use unlimited features.'
                        }
                    });
                }
            }
        });
    }

    newCustomer(payload){
        return new Promise(async(resolve) => {
            try{
                const snapshot = await getDoc(doc(db, "licence",payload.lin_no));
                console.log(snapshot)
                const data = snapshot.exists() ? snapshot.data() : null;
                if(data != null && !data.is_purchased){
                    let data_payload = {
                        mac_add: payload.mac_add,
                        licence_no: payload.lin_no,
                        default_day : data.day_capacity,
                        no_of_days : data.day_capacity,
                        customer_detail:payload.customer_detail,
                        renew_purchase_done : false,
                        reg_date: new Date()
                    }
                    await setDoc(doc(db, "customers",data_payload.mac_add), data_payload);
                    await updateDoc(doc(db, "licence",payload.lin_no), {is_purchased:true});
                    localStorage.setItem("customer_data", JSON.stringify(data_payload));
                    resolve({status:true,message:'Congratulations! Your application has been successfully activated.'});
                }else{
                    resolve({status:false,message:'Invalid licence, please provide a valid licence.'});
                }
            }catch(err){
                console.log(err);
                resolve({status:false,message:'Something went wrong, please try again!'});
            }
        });
    }

    async renewCustomer(payload){
        return new Promise(async(resolve) => {
            try{
                const snapshot = await getDoc(doc(db, "customers",payload.mac_add));
                const data = snapshot.exists() ? snapshot.data() : null
                if(data != null && data.renew_purchase_done){
                    let data_payload = {
                        no_of_days : data.no_of_days+data.default_day,
                        customer_detail:payload.customer_detail,
                        renew_purchase_done : false
                    }
                    await updateDoc(doc(db, "customers",payload.mac_add),data_payload);
                    resolve({status:true,message:'Congratulations! Your application has been successfully activated.'});
                }else{
                    resolve({status:false,message:'For renewal, please contact with developer."'});
                }
            }catch(err){
                console.log(err);
                resolve({status:false,message:'Something went wrong, please try again!'});
            }
        });
    }
}

export default new FireStoreService();