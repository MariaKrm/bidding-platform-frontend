var auctionList = [
	{
		id: 1234,
		name: "Lorem ipsum",
		buyPrice: 10000.0,
		currently: 2000.0,
		endsAt: null,
		categories: [{
			id: 123,
			name: "Electronics"
		}],
		location: {
			latitude: 67.0,
			longitude: 90.89,
			locationTitle: "Somewhere Around Here"
		},
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut sagittis elit, vel dignissim tellus. Vestibulum semper posuere tincidunt. Aenean est arcu, commodo id rhoncus at, consequat eget velit. Sed lectus tellus, pulvinar non augue hendrerit, ultrices efficitur orci. Maecenas lobortis tincidunt placerat. Integer convallis ultricies pretium. Vestibulum aliquet eu urna sed ullamcorper. Nunc quis ligula eget lectus consequat aliquam sed vitae lectus. Mauris hendrerit tempus venenatis. Nunc a felis vitae eros consequat blandit a sed nisi. Nulla ultricies, lectus at facilisis tincidunt, ipsum lorem rhoncus lectus, non sagittis risus metus vel mi. Nam in laoreet quam. Nulla rutrum quam eget nunc venenatis, volutpat iaculis metus auctor. Pellentesque nisi ligula, ornare eu orci nec, fringilla sollicitudin leo. ",
		seller: {
			id: 1234
		}
	},
	{
		id: 1235,
		name: "Battery",
		media: require("../images/Items/battery150.png"),
		alt_image: "battery",
		buyPrice: 20.0,
		currently: 12.5,
		endsAt: null,
		categories: [{
			id: 123,
			name: "Electronics",
		}],
		location: {
			latitude: 123,
			longitude: 234,
			locationTitle: "Table"
		},
		description: "A battery on the table",
		seller: {
			id: 1234
		}
	},
	{
		id: 1236,
		name: "Dried Starfish",
		media: require("../images/Items/starfish150.png"),
		alt_image: "starfish",
		buyPrice: 50.0,
		currently: 3.45,
		endsAt: null,
		categories: [{
			id: 12,
			name: "Pets"
		},
		{
			id: 90,
			name: "Decoration"
		}],
		location: {
			latitude: 123,
			longitude: 234,
			locationTitle: "Sea"
		},
		description: "A starfish long ago dried (RIP)",
		seller: {
			id: 1234
		}
	},
	{
		id: 1237,
		name: "Half Brick",
		media: require("../images/Items/brick150.png"),
		alt_image: "brick",
		buyPrice: 12.0,
		currently: 9.5,
		endsAt: null,
		categories: [{
			id: 12530,
			name: "Things"
		}],
		location: {
			latitude: 123,
			longitude: 234,
			locationTitle: "Constraction Site"
		},
		description: "Once upon a time, a brick broke in half. This is the second half.",
		seller: {
			id: 1234
		}
	},
	{
		id: 1238,
		name: "Dead Lizard",
		media: require("../images/Items/lizard150.png"),
		alt_image: "lizard",
		buyPrice: 100.0,
		currently: 0.5,
		endsAt: null,
		categories: [{
			id: 89,
			name: "Pets"
		}],
		location: {
			latitude: 123,
			longitude: 234,
			locationTitle: "Yard"
		},
		description: "My cat killed a lizard. Does anybody want it?",
		seller: {
			id: 1234
		}
	},

]

export default auctionList