function main()
{
	var actionMovePerform = function(direction)
	{
		var world = Globals.Instance.world;
		var moverActive = world.moverActive();
		var targetPos = moverActive.targetPos;
		if (targetPos == null)
		{
			var moverOrientation = moverActive.orientation;
	 
			if (moverOrientation.equals(direction) == true)
			{
				var moverPosNext = moverActive.pos.clone().add
				(
					direction
				).trimToRangeMax
				(
					world.map.sizeInCellsMinusOnes
				);
				
				var terrain = world.map.terrainAtPos(moverPosNext);
				var movePointsToTraverse = terrain.movePointsToTraverse;
				if (moverActive.movePoints >= movePointsToTraverse)
				{
					if (world.moverAtPos(moverPosNext) == null)
					{
						moverActive.pos.overwriteWith
						(
							moverPosNext
						);  
						moverActive.movePoints -= movePointsToTraverse;
					}
				}
			}
	 
			moverOrientation.overwriteWith
			(
				direction
			);
		}
		else
		{
			var targetPosNext = targetPos.clone().add
			(
				direction
			).trimToRangeMax
			(
				world.map.sizeInCellsMinusOnes
			);
			
			var targetDisplacementNext = targetPosNext.clone().subtract
			(
				moverActive.pos
			);
			
			var targetDistanceNext = targetDisplacementNext.magnitude();
			if (targetDistanceNext <= moverActive.defn().attackRange)
			{
				targetPos.overwriteWith(targetPosNext)
			}
		}
	}
	
	var priority = 0;
	var doNothing = function() {};
	
	var improvementDefns = 
	[
		new ImprovementDefn("Granary", "Grn", 30, priority, doNothing),
		new ImprovementDefn("Library", "Lib", 40, priority, doNothing),
		new ImprovementDefn("Marketplace", "Mkt", 40, priority, doNothing),
		new ImprovementDefn("Walls", "Wal", 100, priority, doNothing),
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
			3 // attackDamage
		),
		
		new MoverDefn
		(
			"Slugger", 
			"B", 
			10, // industryToBuild
			3, // integrityMax
			1, // movePointsPerTurn
			1, // attackRange
			1 // attackDamage
		),
		 
		new MoverDefn
		(
			"Sniper", 
			"C",  
			10, // industryToBuild
			1, // integrityMax
			1, // movePointsPerTurn
			3, // attackRange
			1 // attackDamage
		),
		
		new MoverDefn
		(
			"Sprinter", 
			"D", 
			10, // industryToBuild			
			1, // integrityMax
			3, // movePointsPerTurn
			1, // attackRange
			1
		)
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
			"........",
			".**.~...",
			"^@..~^..",
			"^@..~...",
			".._.....",
			"...~~~..",
			"........",
			"........",
		]
	);
 	
	var base = new Base
	(
		"Base0", //name, 
		new Coords(2, 2), //pos, 
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
		[
			new Mover("Slugger"),		
			new Mover("Sniper"),
		] // moversPresent
	);
 
	var world = new World
	(
		improvementDefns,
		moverDefns,
		map,
		base
	);
 
	Globals.Instance.initialize
	(
		new Display(new Coords(400, 300)),
		world
	);
}
