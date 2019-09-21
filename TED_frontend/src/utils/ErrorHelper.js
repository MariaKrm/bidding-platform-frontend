import Swal from "sweetalert2"

//Show popup with error
export function displayError(error) {
	var errorText = error.response ? error.response.status + ":" + error.response.data.text : error
	Swal.fire({
	    type: "error",
	    title: "Oops...",
	    text: errorText,
	})
}