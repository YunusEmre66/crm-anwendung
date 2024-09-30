import axios from "axios";
import { base } from '@/configs/base'


//! BU KISIM BİR DEFA YAPILIR BİR DAHA YAPILMAZ, BURASI MİDDLE SEVİYEDE BİR KONU

//! utils : genelde projenin her yerinde kullanılan fonksiyonlar, objeler, sabitler burada tanımlanır ve kullanılır.

const axiosServices = axios.create({
    baseURL: base.base,  //! base.base = 'http://localhost:3000/api/v1' oluyor. amacımız her seferinde aynı url yi yazmamak
    timeout: 30000, //! 30 saniye 
    headers: { 
        Accept: 'application/json', //! json formatında veri alacağımızı belirttik
        'Content-Type': 'application/json'  //! json formatında veri göndereceğimizi belirttik
    }
})

//! axiosServices.interceptors.request.use : axiosServices içinde bir request yapmadan önce çalışacak bir fonksiyon

axiosServices.interceptors.request.use((config: any) => {  //! request yapmadan önce burası çalışacak ve config içine token bilgisini ekleyecek 
    const token = localStorage.getItem('token') //! token bilgisini localstorage'dan alıyoruz, kaydetmiştik extrereducers içinde, oradan alıyoruz
    config.headers = {
        ...config.headers,  //! config.headers içindeki bilgileri alıp yeni bir obje oluşturuyoruz
        Authorization: `${token ?? ''}` //! token varsa tokeni ekliyoruz, yoksa boş string ekliyoruz
    }

    return config //! config içinde token bilgisi varsa döndürüyoruz 
}, (error) => { //! hata olursa burası çalışacak 
    return Promise.reject(error) //! hata olduğunda hata mesajını döndürüyoruz 
})

export default axiosServices //! axiosServices i dışarıya açıyoruz 