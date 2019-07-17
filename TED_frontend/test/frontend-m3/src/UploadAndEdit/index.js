import React, { Component } from "react";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import PropTypes from "prop-types";


class UploadAndEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			media: props.media || null,
			scale: 1.0,
			type: props.type || "",
			filter: "none",
			mirror: false,
			dropzoneDesc: "Click here or drop a picture or a video!",
			rotation: 0,
			position: { x: 0.5, y: 0.5 },
			activeFilterIdx: -1

		};

		this.videoRatio = props.videoRatio || "16/9";
		this.border = 5;

		this.borderRadius = 0;

		this.maxSizePhoto = 10485760;
		this.maxSizeVideo = 104857600;

		this.editor = React.createRef();

		this.onDrop = this.onDrop.bind(this);
		this.scaleSlider = this.scaleSlider.bind(this);
		this.resetMedia = this.resetMedia.bind(this);
		this.renderDropzone = this.renderDropzone.bind(this);
		this.renderEditor = this.renderEditor.bind(this);
		this.onDropRejected = this.onDropRejected.bind(this);
		this.toggleMirror = this.toggleMirror.bind(this);
		this.handlePosition = this.handlePosition.bind(this);
		this.flipImage = this.flipImage.bind(this);
		this.createFile = this.createFile.bind(this);
		this.filters = ["none", "bnw", "invert", "sepia", "blur"];
		this.currentFilter = 0;
	}

	onDrop(files) {
		const media = files[0];
		const { type } = media;
		if (type.includes("video/")) {
			if (media.size > this.maxSizeVideo)
				this.onDropRejected(files);
			else {
				const video = document.createElement("VIDEO");
				video.addEventListener("loadedmetadata", () =>
				{
					if (video.videoWidth / video.videoHeight !== eval(this.videoRatio))
						this.setMessage(`Video Not Accepted! Must be ${this.videoRatio}`);
					else if (video.duration > 3 && video.duration < 60)
					{
						this.setState({media, type});
						this.props.handleModified(true);
					}
					else
						this.setMessage("Video Not Accepted! Must be more than 3 seconds and less than 60 seconds");
				});
				video.src = URL.createObjectURL(media);
			}

		} else {
			if (media.size > this.maxSizePhoto)
				this.onDropRejected(files);
			else {
				this.setState({ media, type });
				this.props.handleModified(true);
			}

		}

	}

	setMessage(message)
	{
		this.setState({dropzoneDesc : message});

		setTimeout(function () {this.setState({dropzoneDesc: "Click here or drop a picture, a gif or a video!"});}.bind(this), 3000);

	}

	onDropRejected(files)
	{
		let file = files[0];
		if (file.size > this.maxSize && file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif")
			this.setMessage("Wrong file type and too big! Must be PNG, JPEG or GIF and less than 10MB");
		else if (file.size > this.maxSize)
			this.setMessage("File is too big! Must be less than 10MB");
		else if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif")
			this.setMessage("Wrong file type! Must be PNG, JPEG or GIF");
		else
			this.setMessage("File not accepted! Must be PNG, JPEG or GIF and less than 10MB");

	}

	scaleSlider(event) {
		this.setState({ scale: Number(event.target.value) });
	}

	createFile(blob, name) {
		return new File([blob], name, {
			type: this.state.type
		});
	}

	flipImage() {
		const { current: editor } = this.editor;

		if (editor) {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d");

				// Draw on the canvas the mirrored image
				ctx.translate(canvas.width, 0);
				ctx.scale(-1, 1);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				canvas.toBlob(
					(blob) => {
						// When the canvas is converted to blob, it is redefined as File and the state photo is set
						blob = this.createFile(blob,"picture.png");
						this.setState({media : blob});
					}
				);

			};
			img.src = URL.createObjectURL(this.state.media);
		}
	}


	applyFilter(base64, callback) {
		const image = new Image();
		image.src = base64;
		image.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			const ctx = canvas.getContext("2d");
			switch (this.state.filter) {
			case "bnw":
				ctx.filter = "grayscale(1)";
				break;
			case "invert":
				ctx.filter = "invert(1)";
				break;
			case "sepia":
				ctx.filter = "sepia(1)";
				break;
			case "blur":
				ctx.filter = "blur(5px)";
				break;
			default:
				break;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
			canvas.toBlob(callback);
		};
	}


	toggleFilter(filter) {
		this.setState(state => ({
			filter: (state.filter === filter) ? "none" : filter
		}));
	}

	toggleMirror() {

		this.setState(state => ({ mirror: !state.mirror }));
	}

	getImageFromUploaderAndEditor(cb) {
		const { current: editor } = this.editor;
		if (this.state.type === "image/gif")
		{
			const file = this.createFile(this.state.media, "photo");
			cb(file);
		}
		else if (editor && (this.state.type === "image/jpg" || this.state.type === "image/jpeg" || this.state.type === "image/png"))
		{
			let callback = (item) =>
			{
				const file = this.createFile(item, "photo");
				cb(file);
			};
			const canvas = editor.getImage();
			if (this.state.filter !== "none") {
				this.applyFilter(canvas.toDataURL("image/jpeg"), callback);
			} else {
				canvas.toBlob(blob => callback(blob));
			}
		}
		else {
			const file = this.createFile(this.state.media, "video");
			cb(file);
		}
	}

	handlePosition(position) {
		this.setState({ position: position });
	}

	handleFilters(value) {
		if (value === -1 && this.currentFilter === 0)
			this.currentFilter = this.filters.length - 1;
		else if (value === 1 && this.currentFilter === this.filters.length - 1)
			this.currentFilter = 0;
		else
			this.currentFilter += value;

		this.toggleFilter(this.filters[this.currentFilter]);
	}


	handleRotation(value) {
		let current_rotation = this.state.rotation;
		let newRotation = current_rotation + value;
		if (newRotation > 360)
			newRotation -= 360;

		this.setState({ rotation: newRotation });


	}


	resetMedia() {
		this.setState({
			media: null,
			scale: 1.0,
			type: "",
			filter: "none",
			mirror: false,
			dropzoneDesc: "Click here or drop a file (picture, gif, video)!",
			rotation: 0,
			position: { x: 0.5, y: 0.5 }
		});
		this.props.handleModified(false);
	}

	renderDropzone() {
		return (
			<React.Fragment>
				<div className="before-upload">
					<Dropzone
						onDropAccepted={this.onDrop}
						accept="image/png, image/jpeg, image/gif, video/*"
						multiple={false}
						onDropRejected={this.onDropRejected}
					>

						{({getRootProps, getInputProps, isDragActive, isDragReject}) => (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								{!isDragActive && this.state.dropzoneDesc}
								{isDragActive && !isDragReject && "Drop it here!" }
							</div>
						)}
					</Dropzone>
					<div className="info-img">(Supported files: {this.props.exts.join(", ")})</div>
				</div>
			</React.Fragment>);
	}

	renderNotGif()
	{
		const filterClass = ((this.state.filter === "none") ? "none" : this.state.filter) + ((this.state.mirror) ? " mirror" : "");
		return (
			<div className="editor-avatar">
				<div className="editor-elem">
					<div className={"editor-image "+filterClass}>
						<AvatarEditor
							ref={this.editor}
							image={this.state.media}
							border={this.border}
							borderRadius={this.borderRadius}
							scale={this.state.scale}
							width={this.props.width}
							height={this.props.height}
							position={this.state.position}
							onPositionChange={this.handlePosition}
							/* onImageChange={this.updateData} */
							/*onLoadSuccess={this.updateData}*/
							rotate={this.state.rotation}
						/>
					</div>
					<div className="filters">
						<i className="fas fa-arrow-circle-left" onClick={() => this.handleFilters(-1)}/>
						<div className={filterClass} >{this.state.filter}</div>
						<i className="fas fa-arrow-circle-right"onClick={() => this.handleFilters(1)}/>
						{(this.props.width === this.props.height) ? <i className="mirror fas fa-undo"onClick={() => this.handleRotation(90)}/> : null}
						<i className="material-icons" onClick={() => this.flipImage()}> flip </i>
					</div>
				</div>
				<div className="editor-tools">
					<i className="fas fa-times" onClick={this.resetMedia}/>
					<span><input className="photoSlider" type="range" name="points" defaultValue="1.0" min="0.1" max="3" step="0.01" onChange={this.scaleSlider} /></span>
				</div>
			</div>);
	}

	renderGif() {
		return (<div className="editor-not-img" >
			<div className="editor-image" >
				<img ref={this.editor} src={URL.createObjectURL(this.state.media)} alt={"canvas"}/>
			</div>
			<div className="editor-tools">
				<i className="fas fa-times" onClick={this.resetMedia}/>
			</div>
		</div>
		);
	}

	renderVideo() {
		return (
			<div className="editor-not-img">
				<div className="editor-image">
					<video controls>
						<source src={URL.createObjectURL(this.state.media)} type={this.state.type} />
					</video>
				</div>
				<div className="editor-tools">
					<i className="fas fa-times" onClick={this.resetMedia}/>
				</div>
			</div>
		);
	}

	renderEditor() {
		let editorToRender = <React.Fragment> </React.Fragment>;
		if (this.state.type === "image/gif")
			editorToRender = this.renderGif();
		else if (this.state.type === "image/jpg" || this.state.type === "image/jpeg" || this.state.type === "image/png")
			editorToRender = this.renderNotGif();
		else if (this.state.type.includes("video/"))
			editorToRender = this.renderVideo();
		else
			editorToRender = this.renderNotGif();
		return <div className="editor"> {editorToRender} </div>;
	}

	render() {
		return (this.state.media) ? this.renderEditor() : this.renderDropzone();
	}
}

export default UploadAndEdit;

UploadAndEdit.propTypes = {
	media : PropTypes.object,
	type : PropTypes.string,
	handleModified : PropTypes.func.isRequired,
	videoRatio : PropTypes.string,
	exts: PropTypes.arrayOf(PropTypes.string).isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired
};
