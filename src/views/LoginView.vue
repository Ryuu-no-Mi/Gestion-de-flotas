<template>
  <div class="login">
    <div class="wrapper fadeInDown">
      <div id="formContent">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first">
          <img src="../assets/logo.svg" id="icon" alt="LoginIcon" />
        </div>

        <!-- Login Form -->
        <form v-on:submit.prevent="login">
          <div class="input-wrapper" :class="{ 'input-error-active': emailTouched && !email }">
            <input type="text" id="login" class="fadeIn second" name="login" placeholder="Email" v-model="email"
              @blur="emailTouched = true" />
          </div>
          <div v-if="emailTouched && !email" class="input-error-message">
            El correo es obligatorio.
          </div>

          <!-- Contraseña -->
          <div class="input-wrapper" :class="{ 'input-error-active': passwordTouched && !password }">
            <input type="password" id="password" class="fadeIn third" name="login" placeholder="Password"
              v-model="password" @blur="passwordTouched = true" />
          </div>
          <div v-if="passwordTouched && !password" class="input-error-message">
            La contraseña es obligatoria.
          </div>
          <input type="submit" class="fadeIn fourth" value="Log In">
        </form>

        <div v-if="error" class="error-message">
          <v-alert dense outlined type="error">
            {{ errorMessage }}
          </v-alert>
        </div>

        <!-- Remind Passowrd -->
        <div id="formFooter">
          <a class="underlineHover" href="#">Forgot Password?</a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LoginView',
  comments: {
    // Aquí puedes importar los componentes necesarios, si los hubiera
    axios
  },
  data() {
    return {
      // Aquí puedes definir las propiedades reactivas necesarias para el login
      email: "",
      password: "",
      error: false,
      errorMessage: "",
      emailTouched: false,
      passwordTouched: false
    };
  },
  methods: {
    // Aquí puedes definir los métodos necesarios para manejar el login
    login() {
      let userDto = {
        email: this.email,
        password: this.password
      };

      console.log(`Email: ${userDto.email}, Password: ${userDto.password}`);

      // Aquí puedes hacer la llamada a la API para autenticar al usuario
      axios.post("https://localhost:7077/api/user/login", userDto)
        .then((response) => {
          console.log("respuesta ");
          console.log(response);

          if (response.data) {
            // Si la respuesta es exitosa, guardar el token en localStorage
            localStorage.setItem("token", response.data.token);
            // Redirigir al usuario a la vista principal o donde sea necesario
            this.$router.push({ name: 'home' });
          } else {
            this.error = true;
            this.errorMessage = "Login failed. Please check your credentials.";
          }

        }).catch((error) => {
          console.error("Error during login:", error);
          this.error = true;
          // Manejar el error de login, por ejemplo, mostrar un mensaje al usuario
          this.errorMessage = "Login failed. Please try again later.";
          //this.errorMessage = error.response.data;
        });
    }
  },
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}

a {
  color: #92badd;
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}



/* STRUCTURE */
.login {
  background-color: #fff;
  width: 100%;
  height: 100%;
}

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

#formContent {
  -webkit-border-radius: 0.625rem 0.625rem 0.625rem 0.625rem;
  border-radius: 0.625rem 0.625rem 0.625rem 0.625rem;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}



/* TABS */

h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}



/* FORM TYPOGRAPHY*/

input[type=button],
input[type=submit],
input[type=reset] {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 0.9375rem 5rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 0.8125rem;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  -webkit-border-radius: 0.3125rem 0.3125rem 0.3125rem 0.3125rem;
  border-radius: 0.3125rem 0.3125rem 0.3125rem 0.3125rem;
  margin: 0.3125rem 1.25rem 1.25rem 1.25rem;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover,
input[type=submit]:hover,
input[type=reset]:hover {
  background-color: #39ace7;
}

input[type=button]:active,
input[type=submit]:active,
input[type=reset]:active {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text],
input[type=password] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text]:focus,
input[type=password]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type=text]:placeholder,
input[type=password]:placeholder {
  color: #cccccc;
}

/* Quitamos el borde rojo directo al input */
.input-error {
  background-color: #fff;
  position: relative;
  border-bottom: 2px solid transparent;
}

/* Línea roja animada al estilo underlineHover */
.input-error::after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 7.5%;
  /* Igual que el padding para alinear */
  width: 80%;
  height: 2px;
  background-color: red;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
  transform-origin: left;
}

.input-error:focus::after,
.input-error:valid::after {
  transform: scaleX(0);
  /* Si el campo está bien, ocultamos */
}

.input-error.input-error-active::after {
  transform: scaleX(1);
  /* Mostrar la línea roja */
}

.input-wrapper {
  position: relative;
  width: 85%;
  /* igual que antes, pero aquí */
  margin: 5px auto;
}

.input-wrapper input {
  width: 100%;
  /* ahora ocupa todo el contenedor */
  padding: 15px 32px;
  border: none;
  background-color: #f6f6f6;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
  transition: all 0.5s ease-in-out;
}

.input-wrapper::after {
  content: "";
  position: absolute;
  left: 6px;
  bottom: 0;
  height: 2px;
  width: 100%;
  background-color: rgb(250, 77, 77);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease-in-out;
}

.input-error-active::after {
  transform: scaleX(1);
}

.input-error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
  margin-bottom: 10px;
  text-align: left;
  margin-left: auto;
  margin-right: auto;
  width: 85%;
}

/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;

  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  font-weight: bold;
  color: #0d0d0d;
}

.underlineHover:hover:after {
  width: 100%;
}



/* OTHERS */

*:focus {
  outline: none;
}

#icon {
  width: 20%;
  margin: 0.625rem 0rem;
  padding: 0.625rem;
}

/* ERRORS */
.error-message {
  color: red;
  margin: 10px 0rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}
</style>
