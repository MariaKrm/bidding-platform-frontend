var auctionList = [
	{
		name: "Battery",
		image: require("../images/Items/battery150.png"),
		alt_image: "battery",
		buyPrice: 20.0,
		current_price: 12.5,
		endsAt: null,
		categories: [{
			id: 123,
			name: "Electronics",
		}],
		location: {
			latitude: 123,
			logitude: 234,
			locationTitle: "Table"
		},
		description: "A battery on the table"
	},
	{
		name: "Dried Starfish",
		image: require("../images/Items/starfish150.png"),
		alt_image: "starfish",
		buyPrice: 50.0,
		current_price: 3.45,
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
			logitude: 234,
			locationTitle: "Sea"
		},
		description: "A starfish long ago dried (RIP)"
	},
	{
		name: "Half Brick",
		image: require("../images/Items/brick150.png"),
		alt_image: "brick",
		buyPrice: 12.0,
		current_price: 9.5,
		endsAt: null,
		categories: [{
			id: 12530,
			name: "Things"
		}],
		location: {
			latitude: 123,
			logitude: 234,
			locationTitle: "Constraction Site"
		},
		description: "Once upon a time, a brick broke in half. This is the second half."
	},
	{
		name: "Dead Lizard",
		image: require("../images/Items/lizard150.png"),
		alt_image: "lizard",
		buyPrice: 100.0,
		current_price: 0.5,
		endsAt: null,
		categories: [{
			id: 89,
			name: "Pets"
		}],
		location: {
			latitude: 123,
			logitude: 234,
			locationTitle: "Yard"
		},
		description: "My cat killed a lizard. Does anybody want it?"
	},

]

export default auctionList