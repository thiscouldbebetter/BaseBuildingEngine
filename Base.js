 
function Base(name, pos, demographics, improvements, industry, usage, resources, moversPresent)
{
	this.name = name;
	this.pos = pos;
	this.demographics = demographics;
	this.improvements = improvements;
	this.industry = industry;
	this.usage = usage;
	this.resources = resources;
	this.moversPresent = moversPresent;
}

{
	Base.FoodPerPopulationNeededToGrow = 2;
	
	Base.prototype.initialize = function(world)
	{
		this.usage.optimize(this, world);
		this.resources.initialize(this, world);
	}
	
	Base.prototype.recalculate = function(world)
	{
		this.resources.recalculate(this, world);
		this.controlInvalidate();
	}
	
	Base.prototype.updateForTurn = function(world)
	{
		this.resources.updateForTurn(this, world);
		this.controlInvalidate();
	}
	
	// control
	
	Base.prototype.controlInvalidate = function()
	{
		this._control = null;
		this.demographics._control = null;
		this.improvements._control = null;
		this.industry._control = null;
		this.usage._control = null;
		this.resources._control = null;
	}
	
	Base.prototype.toControl = function(pos, size, world)
	{ 
		if (this._control == null)
		{
			var base = this;
			
			var cellSizeInPixels = new Coords(15, 15);
						 
			var controlDemographics = this.demographics.toControl
			(
				new Coords(1, 1), // pos
				new Coords(10, 2), // size
				cellSizeInPixels,
				this,
				world
			);
			
			var controlImprovements = this.improvements.toControl
			(
				new Coords(1, 4), // pos
				new Coords(10, 2), // size
				cellSizeInPixels,
				this,
				world
			);
			
			var controlIndustry = this.industry.toControl
			(
				new Coords(1, 7), // pos
				new Coords(10, 2), // size
				cellSizeInPixels,
				this,
				world
			);
			
			var controlUsage = this.usage.toControl
			(
				new Coords(12, 1), // pos
				new Coords(12, 12), // size
				cellSizeInPixels,
				this,
				world
			);
			
			var controlMovers = new ControlContainer
			(
				"containerMovers",
				new Coords(1, 10).multiply(cellSizeInPixels), // pos
				new Coords(10, 2).multiply(cellSizeInPixels), // size
				[
					new ControlLabel
					(
						"labelUnits",
						new Coords(0, 0).multiply(cellSizeInPixels),
						"Units:"
					),

					new ControlLabelDynamic
					(
						"infoUnits",
						new Coords(0, 1).multiply(cellSizeInPixels),
						function text()
						{ 
							var returnValue = "";
							var movers = base.moversPresent;
							for (var i = 0; i < movers.length; i++)
							{
								var mover = movers[i];
								if (i > 0)
								{ 
									returnValue += ", ";
								}
								returnValue += mover.defnName;
							}
							return returnValue;
						}
					),
				]
			);
		
			var controlProduction = new ControlContainer
			(
				"containerProduction",
				new Coords(12, 14).multiply(cellSizeInPixels), // pos
				new Coords(12, 4).multiply(cellSizeInPixels), // size
				[
					new ControlLabel
					(
						"labelProduction",
						new Coords(0, 0).multiply(cellSizeInPixels),
						"Production:"
					),

					new ControlLabel
					(
						"labelFood",
						new Coords(0, 1).multiply(cellSizeInPixels),
						"Food:"
					),
					new ControlLabelDynamic
					(
						"infoFood",
						new Coords(3, 1).multiply(cellSizeInPixels),
						function text() 
						{ 
							var foodProduced = base.resources.resourceGroupProducedPerTurn.resources["Food"].quantity;
							var foodConsumed = base.demographics.population;
							var foodNet = foodProduced - foodConsumed;
							var returnValue = foodProduced + " - " + foodConsumed + " = " + foodNet;
							return returnValue;
						}
					),

					new ControlLabel
					(
						"labelIndustry",
						new Coords(0, 2).multiply(cellSizeInPixels),
						"Industry:"
					),
					new ControlLabelDynamic
					(
						"infoIndustry",
						new Coords(3, 2).multiply(cellSizeInPixels),
						function text() 
						{ 
							return base.resources.resourceGroupProducedPerTurn.resources["Industry"].quantity;
						}
					),
					
					new ControlLabel
					(
						"labelTrade",
						new Coords(0, 3).multiply(cellSizeInPixels),
						"Trade:"
					),
					new ControlLabelDynamic
					(
						"infoTrade",
						new Coords(3, 3).multiply(cellSizeInPixels),
						function text() 
						{ 
							return base.resources.resourceGroupProducedPerTurn.resources["Trade"].quantity;
						}
					),
					
				]
			);
			
			var buttonTurnAdvance = new ControlButton
			(
				"buttonTurnAdvance",
				new Coords(1, 19).multiply(cellSizeInPixels), // pos
				new Coords(23, 1).multiply(cellSizeInPixels), // size
				"Next Turn",
				function click() 
				{ 
					base.updateForTurn(world);
				}
			);
						
			this._control = new ControlContainer
			(
				"containerBase",
				pos,
				size,				
				[
					new ControlLabel
					(
						"labelName",
						new Coords(1, 0).multiply(cellSizeInPixels),
						"Name:"
					),
					new ControlLabel
					(
						"infoName",
						new Coords(3, 0).multiply(cellSizeInPixels),
						this.name
					),			
					controlDemographics,
					controlImprovements,
					controlIndustry,
					controlUsage,
					controlProduction,
					controlMovers,
					buttonTurnAdvance
				]
			);
		}
		
		return this._control;
	}	
}

function Base_Demographics(population, foodAccumulated)
{
	this.population = population;
	this.foodAccumulated = foodAccumulated;
}
{	
	Base_Demographics.prototype.toControl = function(pos, size, cellSizeInPixels, base)
	{		
		if (this._control == null)
		{
			this._control = new ControlContainer
			(
				"containerDemographics",
				pos.multiply(cellSizeInPixels), 				
				size.multiply(cellSizeInPixels),				
				[
					new ControlLabel
					(
						"labelPopulation",
						new Coords(0, 0).multiply(cellSizeInPixels),
						"Population:"
					),
					new ControlLabelDynamic
					(
						"infoPopulation", 
						new Coords(4, 0).multiply(cellSizeInPixels), 
						function text() { return base.demographics.population; }
					),
					new ControlLabel
					(
						"labelFood",
						new Coords(0, 1).multiply(cellSizeInPixels),
						"Food:"
					),
					new ControlLabelDynamic
					(
						"infoFood", 
						new Coords(2, 1).multiply(cellSizeInPixels), 
						function text() 
						{ 
							var resources = base.resources;
							var foodCurrent = 
								resources.resourceGroupStockpiled.resources["Food"].quantity;
							var foodPerPopulationNeededToGrow = 
								Base.FoodPerPopulationNeededToGrow;
							var foodNeededToGrow =
								base.demographics.population
								* foodPerPopulationNeededToGrow;
							var returnValue = 
								foodCurrent + "/" + foodNeededToGrow + " to grow";
							return returnValue;
						}
					),
				]
			);
		}
	
		return this._control;
	}
}

function Base_Improvements(improvementDefnNames)
{
	this.improvementDefnNames = improvementDefnNames;
}
{
	Base_Improvements.prototype.improvementDefns = function(world)
	{
		var returnValues = [];
		var improvementDefnsAll = world.improvementDefns;
		for (var i = 0; i < this.improvementDefnNames.length; i++)
		{
			var improvementDefnName = this.improvementDefnNames[i];
			var improvementDefn = improvementDefnsAll[improvementDefnName];
			returnValues.push(improvementDefn);
		}
		return returnValues;
	}
	
	// controls
	
	Base_Improvements.prototype.toControl = function(pos, size, cellSizeInPixels, base, world)
	{
		if (this._control == null)
		{
			this._control = new ControlContainer
			(
				"containerImprovements",
				pos.multiply(cellSizeInPixels), 				
				size.multiply(cellSizeInPixels),				
				[
					new ControlLabel
					(
						"labelImprovements",
						new Coords(0, 0).multiply(cellSizeInPixels),
						"Improvements:"
					),
					new ControlLabelDynamic
					(
						"infoImprovements", 
						new Coords(0, 1).multiply(cellSizeInPixels), 
						function text() 
						{ 
							var returnValue = "";
							var improvementDefnNames =
								base.improvements.improvementDefnNames;
							var improvementDefns = world.improvementDefns;
							for (var i = 0; i < improvementDefnNames.length; i++)
							{
								var improvementDefnName = improvementDefnNames[i];
								if (i > 0)
								{
									returnValue += ", ";
								}
								var improvementDefn = improvementDefns[improvementDefnName];
								returnValue += improvementDefn.symbol;
							}
							return returnValue;
						}
					),
				]
			);
		}
	
		return this._control;
	}
}

function Base_Industry(buildableInProgressDefnName)
{
	this.buildableInProgressDefnName = buildableInProgressDefnName;
}
{
	Base_Industry.prototype.buildableInProgressDefn = function(world)
	{
		return world.buildableDefns[this.buildableInProgressDefnName];
	}
	
	// controls
	
	Base_Industry.prototype.toControl = function(pos, size, cellSizeInPixels, base, world)
	{
		if (this._control == null)
		{
			this._control = new ControlContainer
			(
				"containerIndustry",
				pos.multiply(cellSizeInPixels), 				
				size.multiply(cellSizeInPixels),				
				[
					new ControlLabel
					(
						"labelBuilding",
						new Coords(0, 0).multiply(cellSizeInPixels),
						"Building:"
					),
					new ControlLabelDynamic
					(
						"infoBuilding", 
						new Coords(3, 0).multiply(cellSizeInPixels), 
						function text()
						{ 
							var defnName = base.industry.buildableInProgressDefnName;
							return (defnName == null ? "[nothing]" : defnName);
						}
					),
					new ControlButton
					(
						"buttonBuildingNext", 
						new Coords(7, 0).multiply(cellSizeInPixels), 
						new Coords(2, 1).multiply(cellSizeInPixels),
						"Next",
						function click()
						{
							var buildableDefnsAvailable = world.buildableDefns;
							var buildableDefnNamesAvailable =
								buildableDefnsAvailable.select("name");
							var industry = base.industry;
							var buildableToBuildDefnName = industry.buildableInProgressDefnName;
							var buildableToBuildDefnIndex;
							if (buildableToBuildDefnName == null)
							{
								buildableToBuildDefnIndex = 0;
							}
							else
							{
								buildableToBuildDefnIndex =
									buildableDefnNamesAvailable.indexOf(buildableToBuildDefnName) + 1;
							}
							buildableToBuildDefnName = buildableDefnNamesAvailable[buildableToBuildDefnIndex];
							industry.buildableInProgressDefnName = buildableToBuildDefnName;
						}
					),					
					new ControlLabel
					(
						"labelProgress",
						new Coords(0, 1).multiply(cellSizeInPixels),
						"Progress:"
					),
					new ControlLabelDynamic
					(
						"infoProgress", 
						new Coords(3, 1).multiply(cellSizeInPixels), 
						function text() 
						{
							var returnValue;
							var industry = base.industry;							
							if (industry.buildableInProgressDefnName == null)
							{
								returnValue = "";
							}
							else
							{
								var industryStockpiled = 
									base.resources.resourceGroupStockpiled.resources["Industry"];
								var buildableInProgressDefn = industry.buildableInProgressDefn(world);
								returnValue = 
									industryStockpiled.quantity 
									+ "/"
									+ buildableInProgressDefn.industryToBuild;
							}
							return returnValue;
						}
					),
				]
			);
		}
	
		return this._control;
	}
}

function Base_Resources()
{
	this.resourceGroupProducedPerTurn = new ResourceGroup([]);
	this.resourceGroupStockpiled = new ResourceGroup
	([
		new Resource("Food", 0),
		new Resource("Industry", 0)
	]);	
}
{	
	Base_Resources.prototype.initialize = function(base, world)
	{
		this.recalculate(base, world);
	}
	
	Base_Resources.prototype.recalculate = function(base, world)
	{
		var cellsInUseTerrains = base.usage.cellsInUseTerrains(base, world);
		var resourceGroupProducedByBase = this.resourceGroupProducedPerTurn;
		resourceGroupProducedByBase.clear();
		var map = world.map;
		for (var i = 0; i < cellsInUseTerrains.length; i++)
		{
			var cellTerrain = cellsInUseTerrains[i];
			var resourcesProducedByCell = cellTerrain.resourcesProducedPerTurn;
			resourceGroupProducedByBase.resourcesAdd(resourcesProducedByCell);
		}
		
		var improvementDefns = base.improvements.improvementDefns(world);
		for (var i = 0; i < improvementDefns.length; i++)
		{
			var improvementDefn = improvementDefns[i];
			improvementDefn.applyToBase(base);
		}
	}
	
	Base_Resources.prototype.updateForTurn = function(base, world)
	{
		this.resourceGroupStockpiled.add(this.resourceGroupProducedPerTurn);

		var foodConsumed = new Resource("Food", 0 - base.demographics.population);
		this.resourceGroupStockpiled.resourceAdd(foodConsumed);
		
		var resourcesStockpiled = this.resourceGroupStockpiled.resources;
		
		var foodStockpiled = resourcesStockpiled["Food"];
		var population = base.demographics.population;
		if (foodStockpiled.quantity < 0)
		{
			base.demographics.population--;
			base.usage.optimize(base, world);
		}
		else
		{
			var foodPerPopulationNeededToGrow = 
				Base.FoodPerPopulationNeededToGrow;
			var foodNeededToGrow =
				foodPerPopulationNeededToGrow * population;
			if (foodStockpiled.quantity >= foodNeededToGrow)
			{
				base.demographics.population++;
				foodStockpiled.quantity -= foodNeededToGrow;
			}
			base.usage.optimize(base, world);
		}
	}
}

function Base_Usage(offsetsOfCellsInUse)
{
	this.offsetsOfCellsInUse =
		(offsetsOfCellsInUse == null ? [ new Coords(0, 0) ] : offsetsOfCellsInUse);
}
{
	Base_Usage.UsageRadiusInCells = 2;
	
	Base_Usage.prototype.cellAtOffsetIsInUse = function(cellOffsetToCheck)
	{
		var returnValue = false;
		
		for (var i = 0; i < this.offsetsOfCellsInUse.length; i++)
		{
			var cellOffsetInUse = this.offsetsOfCellsInUse[i];
			if (cellOffsetInUse.equals(cellOffsetToCheck))
			{
				returnValue = true;
				break;
			}
		}
		
		return returnValue;
	}
	
	Base_Usage.prototype.cellAtOffsetUseToggle = function(cellOffsetToToggle)
	{
		var cellOffsetFound = null;
		for (var i = 0; i < this.offsetsOfCellsInUse.length; i++)
		{
			var cellOffsetInUse = this.offsetsOfCellsInUse[i];
			if (cellOffsetInUse.equals(cellOffsetToToggle))
			{
				cellOffsetFound = cellOffsetInUse;
				break;
			}
		}
		if (cellOffsetFound == null)
		{
			this.offsetsOfCellsInUse.push(cellOffsetToToggle.clone());
		}
		else
		{
			this.offsetsOfCellsInUse.remove(cellOffsetFound);
		}
	}
	
	Base_Usage.prototype.cellsInUseTerrains = function(base, world)
	{
		var returnValues = [];
		
		var map = world.map;
		var basePos = base.pos;
		var cellPos = new Coords();
		for (var i = 0; i < this.offsetsOfCellsInUse.length; i++)
		{
			var cellOffsetInUse = this.offsetsOfCellsInUse[i];
			cellPos.overwriteWith(cellOffsetInUse).add(basePos);
			var cellTerrain = map.terrainAtPos(cellPos);
			returnValues.push(cellTerrain);
		}
		
		return returnValues;
	}
	
	Base_Usage.prototype.optimize = function(base, world)
	{				
		var population = base.demographics.population;

		while (this.offsetsOfCellsInUse.length > population)
		{
			this.offsetsOfCellsInUse.length--;
		}
		
		var usageRadiusInCells = Base_Usage.UsageRadiusInCells;
		var usageDiameterInCells = usageRadiusInCells * 2 + 1;
		var i = 0;
		while (this.offsetsOfCellsInUse.length < population)
		{
			var cellOffsetToUse = new Coords(-1, -1).multiplyScalar
			(
				usageRadiusInCells
			).add
			(
				new Coords
				(
					i % usageDiameterInCells,
					Math.floor(i / usageDiameterInCells)
				)
			);
			
			if (this.cellAtOffsetIsInUse(cellOffsetToUse) == false)
			{
				this.offsetsOfCellsInUse.push(cellOffsetToUse);
			}
			
			i++;
		}
	}
	
	// controls
	
	Base_Usage.prototype.toControl = function(pos, size, cellSizeInPixels, base, world)
	{
		if (this._control == null)
		{
			var childControls = [];
			
			var cellOffset = new Coords();
			var buttonSize = cellSizeInPixels.clone().multiplyScalar(2);
			var usageRadiusInCells = Base_Usage.UsageRadiusInCells;
			var centerInCells = new Coords(1, 1).multiplyScalar(usageRadiusInCells);
			var basePosInCells = base.pos;
			var cellPosInCells = new Coords();
			var map = world.map;
			var zeroes = new Coords(0, 0);
			for (var y = -usageRadiusInCells; y <= usageRadiusInCells; y++)
			{
				cellOffset.y = y;
				
				for (var x = -usageRadiusInCells; x <= usageRadiusInCells; x++)
				{
					cellOffset.x = x;
										
					cellPosInCells
						.overwriteWith(basePosInCells)
						.add(cellOffset);

					var cellTerrain = map.terrainAtPos(cellPosInCells);
												
					var buttonPos =
						centerInCells.clone()
							.add(cellOffset)
							.multiply(cellSizeInPixels)
							.multiplyScalar(2);
					
					var cellText;					
					var isCellInUse = base.usage.cellAtOffsetIsInUse(cellOffset);
					if (isCellInUse)
					{
						var cellResources = cellTerrain.resourcesProducedPerTurn;
						var food = cellResources["Food"].quantity;
						var industry = cellResources["Industry"].quantity;
						var trade = cellResources["Trade"].quantity;
						cellText = food + "/" + industry + "/" + trade;
					}
					else
					{
						cellText = "";
					}
					
					var buttonForCellClick;
					if (cellOffset.equals(zeroes))
					{
						buttonForCellClick = function click() 
						{
							var usage = base.usage;
							usage.optimize(base, world); 
							base.recalculate(world);
						};
					}
					else
					{
						buttonForCellClick = function click(button) 
						{ 
							var cellOffset = button.context;
							var usage = base.usage;
							usage.cellAtOffsetUseToggle(cellOffset);
							base.recalculate(world);
						};
					}
										
					var buttonForCell = new ControlButton
					(
						"button" + x + "_" + y,
						buttonPos,
						buttonSize,
						cellText,
						buttonForCellClick,
						cellOffset.clone(), // context
						cellTerrain.color
					);
					
					childControls.push(buttonForCell);
				}
			}
			
			var containerUsageCells = new ControlContainer
			(
				"containerUsageCells",
				new Coords(1, 1).multiply(cellSizeInPixels),
				cellSizeInPixels.clone().multiplyScalar(2 * usageRadiusInCells + 1).multiplyScalar(2),
				childControls
			);
			
			this._control = new ControlContainer
			(
				"containerUsage",
				pos.multiply(cellSizeInPixels),
				size.multiply(cellSizeInPixels),
				[
					new ControlLabel
					(
						"labelUsage",
						new Coords(0, 0).multiply(cellSizeInPixels),
						"Usage:"
					),
				
					containerUsageCells
				]
			);
			
		}
	
		return this._control;
	}
}