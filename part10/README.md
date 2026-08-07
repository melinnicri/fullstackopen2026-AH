# Full Stack Open 2026 - Parte 10: React Native

Repositorio correspondiente a la décima parte del curso Full Stack Open, donde se desarrolló una aplicación móvil completa en React Native conectada a una API GraphQL con Apollo Client, autenticación de usuarios, pruebas unitarias y despliegue en la nube mediante EAS.

## 📱 Demostración de la Aplicación (Código QR)

Para probar la aplicación directamente en un dispositivo físico (mediante la app **Expo Go**) o en un emulador escaneando el código QR de preproducción:

![Código QR de EAS Update](./rate-repository-app/assets/qr.png)

> *Nota: Asegúrate de escanear este código utilizando la aplicación Expo Go.*

## 🚀 Funcionalidades implementadas
- **Listado de Repositorios:** Visualización de repositorios paginados con ordenamiento y filtrado (*debounced*).
- **Vista de Detalle y Reseñas:** Consulta de un repositorio individual con enlace directo a GitHub (`expo-linking`) y listado de reseñas formateadas con `date-fns`.
- **Autenticación Completa:** Formularios de inicio de sesión (`SignIn`) y registro (`SignUp`) validados con **Formik** y **Yup**, persistencia segura de tokens (`AsyncStorage`) y gestión de sesiones con `Apollo Client`.
- **Gestión de Reseñas de Usuario:** Vista para consultar las reseñas propias del usuario autenticado con opciones para ver el repositorio o eliminar la reseña (con confirmación por `Alert`).
- **Pruebas (Testing):** Cobertura de pruebas unitarias y de componentes mediante **Jest** y `@testing-library/react-native`.

## 🛠️ Tecnologías Utilizadas
- React Native / Expo (SDK 55)
- Apollo Client & GraphQL
- React Router Native
- Formik & Yup
- Jest & React Native Testing Library
- EAS Update

```
PS C:...\fullstackopen2026-AH\part10\rate-repository-api> npm start (como backend)
 
PS C:...\fullstackopen2026-AH\part10\rate-repository-app> npx expo start (como frontend) 


PS C:...\fullstackopen2026-AH\part10\rate-repository-app> npm test              

> rate-repository-app@1.0.0 test
> jest

 PASS  src/__tests__/examples/example.test.js (6.873 s)
 PASS  src/__tests__/examples/Greeting.test.js (12.649 s)
  ● <View>
      <Text>
        Hello 
        Kalle
        !
      </Text>
    </View>

 PASS  src/__tests__/examples/Form.test.js (13.782 s)
 PASS  src/__tests__/components/SignIn/SignIn.test.js (18.101 s)
 PASS  src/__tests__/components/RepositoryList/RepositoryList.test.js (33.231 s)

Test Suites: 5 passed, 5 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        35.108 s
Ran all test suites.
```