export enum UserConfirmedEnum { PENDING = 'pending', EMAIL = 'email', APPROVAL = 'approval', DENIED = 'denied' };

//approval : onaylandı, denied : reddedildi
// pending : bekleyen, 
// email : email onayı gerekiyor

//sırasıyla user için onay durumları
// pending : bekleyen
// email : email onayı gerekiyor
// approval : onaylandı
// denied : reddedildi

//! özet : kişi üye olmak ister, kayıt formunu doldurur ve kayıt ol butonuna basar. daha sonra mail adresine bir link gider.
//! maildeki linke tıkladığında onaylanmış olur ve artık sisteme giriş yapabilir.
//! mail adresi onaylanmadan sisteme giriş yapamaz. onaylanınca email durumu approval olur. eğer kişiyle alakalı bir sorun varsa bu seferden reddedilir ve denied olur.

//! Path: crm-example-express-next-js/crm-backend/src/entity/User.ts
