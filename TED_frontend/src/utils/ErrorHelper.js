import Swal from "sweetalert2"


export function displayError(error) {
	console.log("Error: ", error)
	var errorText = error.response ? error.response.status + ":" + error.response.data.text : error
	Swal.fire({
	    type: "error",
	    title: "Oops...",
	    text: errorText,
	})
}