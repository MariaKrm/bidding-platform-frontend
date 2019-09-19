import React from "react"
import decode from "jwt-decode"
import * as Constants from "../Constants/Constants"
import axios from "axios"

//https://medium.com/@romanchvalbo/how-i-set-up-react-and-node-with-json-web-token-for-authentication-259ec1a90352

class AuthHelper {

  //Returns true if user is logged in and verified
  static loggedIn() {
    const token = AuthHelper.getToken()
    if(token && !AuthHelper.isTokenExpired(token)) {
      return !AuthHelper.unverifiedUser()
    }
    else {
      return false
    }
  }

  //Returns true if user is logged in and not verified (false if visitor or verified)
  static unverifiedUser() {
    const user = JSON.parse(sessionStorage.getItem("user"))
    if(user) {
      return !user.verified
    }
    else {
      return false
    }
  }

  static isAdmin() {
    const user = JSON.parse(sessionStorage.getItem("user"))
    if(user) {
      return user.admin
    }
    else {
      return false
    }
  }

  static me() {
    return JSON.parse(sessionStorage.getItem("user"))
  }

  static verify() {
    let user = AuthHelper.me()
    if(user) {
      user.verified = true
      AuthHelper.setUser(user)
    }
  }

  static isTokenExpired(token) {
    try {
      const decoded = decode(token)
      if(decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true
      } else return false
    } catch (err) {
      console.log("Expired check failed!")
      return false
    }
  }

  static setUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user))
  }

  static setToken(idToken) {
    // Saves user token to localStorage
    sessionStorage.setItem("id_token", idToken)
  }

  static getToken() {
    // Retrieves the user token from localStorage
    return sessionStorage.getItem("id_token")
  }

  static logout() {
    // Clear user token and profile data from localStorage
    setTimeout(() => {
      sessionStorage.removeItem("id_token")
      sessionStorage.removeItem("user")
    }, 500)
    
  }

  static getConfirm() {
    // Using jwt-decode npm package to decode the token
    let answer = decode(AuthHelper.getToken())
    return answer
  }

  static displayVisitorSign() {
    if(!AuthHelper.loggedIn()) {
      if(AuthHelper.unverifiedUser()) {
        return (
            <div className="alert alert-info" style={{margin: 0}}>
              Your account's verification is pending. Until then you won't be able to access all features.
            </div>
          )
      }
      else {
        return (
          <div className="alert alert-info" style={{margin: 0}}>
            You are logged in as a visitor. Sign up to access all features.
          </div>
        )
      }
    }
    else {
      return null
    }
  }

}

export function customRequest(method, url, data, header) {
    // performs api calls sending the required authentication headers
    let headers = {
    }
    if(header) {
      headers = header
    }
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
      headers["Authorization"] = "Bearer " + AuthHelper.getToken()
    }

    return axios.request({
      url: url,
      method: method,
      baseURL: Constants.BASEURL,
      headers: headers,
      data: data,
    }).then(res => {
      console.log("\nResponse from " + res.request.responseURL + ":", res, "\n")
      return res;
    }).catch(err => {
      console.log("\nError from " + Constants.BASEURL + url + "\n")
      err.response ? console.error(err.response.data) : console.error(err)
      throw err;
    });
  }


export default AuthHelper
