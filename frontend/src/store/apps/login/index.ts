import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
//! ** Config
import { auth } from '@/configs/auth'

//! ** Utils


import axiosServices from '@/utils/axios-services'
import { getToken } from '@/utils/get-token'

//! bu kısım kalıp gibi kullanılır, her proje için aynıdır 

//! login değişkeni extraReducers içinde kullanılıyor, bu yüzden burada tanımlandı 

export const login = createAsyncThunk('login', async (payload: any) => { //! payload = {email: 'email', password: 'password'} , payload muhakkak olmalı
    const response = await axiosServices.post(auth.login, payload)  //! auth.login = '/auth/login' oluyor //! dinamik bir şekilde oluşturuldu

    return response.data //! bize buradan dönen response.data içinde token ve user bilgileri var 
})

export const getIsLogin = createAsyncThunk('getIsLogin', async () => { //! bu kısım login olup olmadığını kontrol etmek için kullanılıyor
    const response = await axiosServices.get(auth.isLogin) //! auth.isLogin = '/auth/is-login' oluyor, backend tarafında bu route oluşturuldu

    return response.data 
})

export const appLoginSlice = createSlice({ //! createSlice ile bir slice oluşturuyoruz , slice demek bir state ve reducer'ın bir arada olduğu bir yapıdır 
    name: 'auth',
    initialState: {
        data: {},
        loading: false,
        isToken: false,
        isLogin: false,
        loginErrorMessage: ""
    },
    reducers: {  //! reducers içinde state'i değiştiren fonksiyonları tanımlıyoruz ve bu fonksiyonları action'lar ile tetikliyoruz  
        handleToken: (state: any, action: PayloadAction<string>) => { //! tokeni localstorage'dan alıp state'e atıyoruz 
            if (getToken())
                state.isToken = true
        },
        logout: (state: any) => {  //! logout olduğunda state'i sıfırlıyoruz ve tokeni siliyoruz 
            state.isLogin = false
            localStorage.removeItem('token')
        },
        setIsLogin: (state: any, action: any) => {
            console.log('reducers >>> ');
            
        }
    },
    extraReducers: builder => {  //! extraReducers içinde async thunk'larımızı tanımlıyoruz
        builder.addCase(login.pending, (state: any) => {  //! login bize yukarıda tanımladığımız gibi bir payload döndürüyor, bu payload dönerken loading true oluyor
            state.loading = true
        })
        builder.addCase(login.fulfilled, (state: any, action: any) => { //! LOGİN BAŞARILI OLDUĞUNDA   !!!!! ÖENMLİ KISIM
            localStorage.setItem('token', action.payload.token)  //! tokeni localstorage a kaydettik , action.payload içinde token ve user bilgileri var
           
            state.data = action.payload  //! burada state.data içine action.payload yani token ve user bilgilerini atadık
            state.isLogin = true
            state.isToken = true
            state.loading = false
        })
        builder.addCase(login.rejected, (state: any, action: any) => {  //! LOGIN BAŞARISIZ OLDUĞUNDA
            state.loading = false            
        })

        builder.addCase(getIsLogin.pending, (state: any) => { //! LOGIN OLUP OLMADIĞINI KONTROL EDERKEN 
            //state.isLogin = false
        })
        builder.addCase(getIsLogin.fulfilled, (state: any) => { //! LOGIN OLUP OLMADIĞINI KONTROL EDERKEN
            state.isLogin = true //! true ise login olmuş demektir
        })
        builder.addCase(getIsLogin.rejected, (state: any) => { //! LOGIN OLUP OLMADIĞINI KONTROL EDERKEN
            localStorage.removeItem('token')  //! tokeni sildik
            state.isLogin = false //! false ise login olmamış demektir
        })
    }
})

export const { handleToken, logout, setIsLogin } = appLoginSlice.actions  //! BAŞKA BİR COMPONENTTEN KULLANMAK İÇİN EXPORT ETTİK, actions daima bu şekilde export edilir
export default appLoginSlice.reducer