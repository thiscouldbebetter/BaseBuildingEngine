function main()
{
	var incomeAllocations = [];
	for (var researchPercentage = 0; researchPercentage <= 100; researchPercentage += 10)
	{
		var incomeAllocation = new IncomeAllocation(researchPercentage);
		incomeAllocations.push(incomeAllocation);
	}

	var priority = 0;
	var doNothing = function() {};

	var improvementDefns =
	[
		new ImprovementDefn
		(
			"Courthouse",
			"Crt",
			40,
			priority,
			"Halves corruption.",
			doNothing
		),

		new ImprovementDefn
		(
			"Granary",
			"Grn",
			30,
			priority,
			"Halves food consumed to grow population.",
			doNothing
		),

		new ImprovementDefn
		(
			"Library",
			"Lib",
			40,
			priority,
			"Doubles research.",
			function(resourceGroup)
			{
				resourceGroup.resources["Research"].quantity *= 2;
			}
		),

		new ImprovementDefn
		(
			"Marketplace",
			"Mkt",
			40,
			priority,
			"Doubles tax income.",
			doNothing
		),

		new ImprovementDefn
		(
			"Walls",
			"Wal",
			100,
			priority,
			"Triples defense strength.",
			doNothing
		),
	];

	var moverDefns =
	[
		new MoverDefn
		(
			"Slicer",
			"A",
			10, // industryToBuild
			1, // integrityMax
			1, // movePointsPerTurn
			1, // attackRange
			3, // attackDamage
			1 // defense
		),

		new MoverDefn
		(
			"Slugger",
			"B",
			10, // industryToBuild
			3, // integrityMax
			1, // movePointsPerTurn
			1, // attackRange
			1, // attackDamage
			1 // defense
		),

		new MoverDefn
		(
			"Sniper",
			"C",
			10, // industryToBuild
			1, // integrityMax
			1, // movePointsPerTurn
			3, // attackRange
			1, // attackDamage
			1 // defense
		),

		new MoverDefn
		(
			"Sprinter",
			"D",
			10, // industryToBuild
			1, // integrityMax
			3, // movePointsPerTurn
			1, // attackRange
			1, // attackDamage
			1 // defense
		)
	];

	var technologies = 
	[
		new Technology("Writing", 30, "todo"),
		new Technology("Pottery", 30, "todo"),
		new Technology("Masonry", 30, "todo"),
	];

	var mapTerrains =
	[
		new MapTerrain
		(
			"Desert", "_", 2, "Yellow",
			[
				new Resource("Food", 0),
				new Resource("Industry", 0),
				new Resource("Trade", 0),
			]
		),
		new MapTerrain
		(
			"Grassland", ".", 1, "rgb(0,200,0)",
			[
				new Resource("Food", 2),
				new Resource("Industry", 0),
				new Resource("Trade", 0),
			]
		),
		new MapTerrain
		(
			"Hills", "@", 2, "Tan",
			[
				new Resource("Food", 1),
				new Resource("Industry", 1),
				new Resource("Trade", 0),
			]
		),
		new MapTerrain
		(
			"Mountains", "^", 3, "White",
			[
				new Resource("Food", 0),
				new Resource("Industry", 2),
				new Resource("Trade", 0),
			]
		),
		new MapTerrain
		(
			"Forest", "*", 2, "DarkGreen",
			[
				new Resource("Food", 1),
				new Resource("Industry", 1),
				new Resource("Trade", 0),
			]
		),
		new MapTerrain
		(
			"Water", "~", 100, "Blue",
			[
				new Resource("Food", 1),
				new Resource("Industry", 0),
				new Resource("Trade", 1),
			]
		),
	];

	var map = new Map
	(
		new Coords(20, 20), // cellSizeInPixels
		new Coords(20, 20), // pos
		mapTerrains,
		// cellsAsStrings
		[
			".....r..........",
			"..*.*r..~.......",
			"^.@..r..~.^.....",
			"^.@..r..~.......",
			"...._r..........",
			".....r~.~.~.....",
			".....r..........",
			".....r..........",
		]
	);

	var base = new Base
	(
		"Baseville", // name,
		new Coords(2, 2), // pos,
		new Base_National
		(
			"Basonia", 
			incomeAllocations[0].name,
			100, // currencyStockpiled
			null, // technologyBeingResearchedName 
			0, // researchStockpiled
			[] // technologiesKnownNames
		),
		new Base_Demographics(10),
		new Base_Improvements
		([
			"Granary",
			"Library",
			"Marketplace",
		]),
		new Base_Industry(null, 10),
		new Base_Usage(),
		new Base_Resources(),
		new Base_Movers
		(
			[
				new Mover("Slugger"),
				new Mover("Sniper"),
			] // moversPresent
		)
	);

	var world = new World
	(
		incomeAllocations,
		improvementDefns,
		moverDefns,
		technologies,
		map,
		base
	);

	Globals.Instance.initialize(world);
}
