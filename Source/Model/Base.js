
function Base(name, nationName, geography, demographics, improvements, industry, usage, resources, movers)
{
	this.name = name;
	this.nationName = nationName;
	this.geography = geography;
	this.demographics = demographics;
	this.improvements = improvements;
	this.industry = industry;
	this.usage = usage;
	this.resources = resources;
	this.movers = movers;
}

{
	Base.FoodPerPopulationNeededToGrow = 2;

	Base.prototype.foodProduction = function()
	{
		var base = this;
		var foodProduced = base.resources.resourceGroupProducedPerTurn.resources["Food"].quantity;
		var foodConsumed = base.demographics.population;
		var foodNet = foodProduced - foodConsumed;
		var returnValue = foodProduced + " produced - " + foodConsumed + " consumed = " + foodNet;
		return returnValue;
	}

	Base.prototype.foodStockpiledOverNeededToGrow = function()
	{
		var resources = this.resources;
		var foodCurrent =
			resources.resourceGroupStockpiled.resources["Food"].quantity;
		var foodPerPopulationNeededToGrow =
			Base.FoodPerPopulationNeededToGrow;
		var foodNeededToGrow =
			this.demographics.population
			* foodPerPopulationNeededToGrow;
		var returnValue =
			foodCurrent + "/" + foodNeededToGrow + " to grow";
		return returnValue;
	}

	Base.prototype.industryPerTurn = function()
	{
		return this.resources.resourceGroupProducedPerTurn.resources["Industry"].quantity;
	}

	Base.prototype.industryProduction = function()
	{
		var industryProduced = this.industryPerTurn();
		var industryConsumed = 0; // todo
		var industrySurplus = industryProduced - industryConsumed;
		var industryWasted = 0; // todo
		var returnValue = 
			industryProduced + " produced - " 
			+ industryConsumed + " upkeep - " 
			+ industryWasted + " wasted = " 
			+ industrySurplus;
		return returnValue;
	}

	Base.prototype.industryStockpiledOverNeeded = function()
	{
		var returnValue;
		var base = this;
		var industry = base.industry;
		if (industry.buildableInProgressDefnName == null)
		{
			returnValue = "[no project]";
		}
		else
		{
			var industryStockpiled =
				base.resources.resourceGroupStockpiled.resources["Industry"];
			var world = Globals.Instance.world; // hack
			var buildableInProgressDefn = industry.buildableInProgressDefn(world);
			returnValue =
				industryStockpiled.quantity
				+ "/" + buildableInProgressDefn.industryToBuild;
		}
		return returnValue;
	}

	Base.prototype.nation = function(world)
	{
		return world.nations[this.nationName];
	}

	Base.prototype.researchPerTurn = function(world)
	{
		var tradePerTurn = this.tradePerTurn();
		var incomeAllocation = this.nation(world).incomeAllocation(world);
		var returnValue = Math.round(tradePerTurn * incomeAllocation.researchRate());
		return returnValue;
	}

	Base.prototype.taxesPerTurn = function(world)
	{
		var tradePerTurn = this.tradePerTurn();
		var researchPerTurn = this.researchPerTurn(world);
		var returnValue = tradePerTurn - researchPerTurn;
		return returnValue;
	}

	Base.prototype.tradePerTurn = function()
	{
		return this.resources.resourceGroupProducedPerTurn.resources["Trade"].quantity;
	}

	Base.prototype.tradeProduction = function(world)
	{
		var tradeProduced = this.tradePerTurn();
		var tradeWasted = 0; // todo
		var tradeSurplus = tradeProduced - tradeWasted;
		var researchPerTurn = this.researchPerTurn(world);
		var taxesPerTurn = this.taxesPerTurn(world);
		var returnValue = 
			+ tradeProduced + " produced - "
			+ tradeWasted + " wasted = "
			+ tradeSurplus
			+ " = " + taxesPerTurn + " taxes"
			+ " + " + researchPerTurn + " research";
		return returnValue;
	}

	Base.prototype.initialize = function(world, nation)
	{
		this.usage.optimize(this, world);
		this.resources.initialize(this, world);
	}

	Base.prototype.recalculate = function(world)
	{
		this.resources.recalculate(this, world);
		this.controlInvalidate();
	}

	Base.prototype.updateForTurn = function(world, nation)
	{
		this.resources.updateForTurn(this, world);
		this.controlInvalidate();
		world.update();
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
		this.movers._control = null;
	}

	Base.prototype.toControl = function(world)
	{
		if (this._control == null)
		{
			var base = this;

			var controlGeography = this.geography.toControl(this, world);
			var controlDemographics = this.demographics.toControl(this, world);
			var controlImprovements = this.improvements.toControl(this, world);
			var controlIndustry = this.industry.toControl(this, world);
			var controlUsage = this.usage.toControl(this, world);
			var controlMovers = this.movers.toControl(this, world);

			var controlProduction = new ControlContainer
			(
				"containerProduction",
				[
					new ControlLabel
					(
						"labelProduction",
						"Production:"
					),
					new ControlBreak(),

					new ControlLabel
					(
						"labelFood",
						"Food:"
					),
					new ControlLabel
					(
						"infoFood",
						new DataBinding
						(
							base,
							function(context) { return context.foodProduction(); }
						)
					),
					new ControlBreak(),

					new ControlLabel
					(
						"labelIndustry",
						"Industry:"
					),
					new ControlLabel
					(
						"infoIndustry",
						new DataBinding
						(
							base,
							function(context) { return context.industryProduction(); }
						)
					),
					new ControlBreak(),

					new ControlLabel
					(
						"labelTrade",
						"Trade:"
					),
					new ControlLabel
					(
						"infoTrade",
						new DataBinding
						(
							base,
							function(context) { return context.tradeProduction(world); }
						)
					),
					new ControlBreak(),
				]
			);

			var buttonTurnAdvance = new ControlButton
			(
				"buttonTurnAdvance",
				null, // size
				"Next Turn",
				function click()
				{
					world.updateForTurn();
				}
			);

			this._control = new ControlContainer
			(
				"containerBase",
				[
					controlGeography,
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
	Base_Demographics.prototype.toControl = function(base)
	{
		if (this._control == null)
		{
			this._control = new ControlContainer
			(
				"containerDemographics",
				[
					new ControlLabel
					(
						"labelPopulation",
						"Population:"
					),
					new ControlLabel
					(
						"infoPopulation",
						new DataBinding
						(
							base.demographics,
							function(context) { return context.population; }
						)
					),
					new ControlBreak(),

					new ControlLabel
					(
						"labelFood",
						"Food:"
					),
					new ControlLabel
					(
						"infoFood",
						new DataBinding
						(
							base,
							function(context) { return context.foodStockpiledOverNeededToGrow(); }
						)
					),
				]
			);
		}

		return this._control;
	}
}

function Base_Geography(pos)
{
	this.pos = pos;
}
{
	Base_Geography.prototype.distanceFromCapital = function(world, base)
	{
		var baseCapital = base.nation(world).baseCapital();
		var displacementFromCapital = this.pos.clone().subtract(baseCapital.geography.pos);
		var returnValue = Math.ceil(displacementFromCapital.magnitude());
		return returnValue;
	}

	// controls

	Base_Geography.prototype.toControl = function(base, world)
	{
		var returnValue = new ControlContainer
		(
			"containerGeography",
			[
				new ControlLabel("labelDistanceFromCapital", "Distance from Capital:"),
				new ControlLabel("infoDistanceFromCapital", this.distanceFromCapital(world, base)),
			]
		);
		
		return returnValue;
	}
}

function Base_Improvements(improvementDefnNames)
{
	this.improvementDefnNames = improvementDefnNames.addLookups("name");
	this.improvementDefnNameSelected = null;
}
{
	Base_Improvements.prototype.improvementDefnSelected = function(world)
	{
		var defnName = this.improvementDefnNameSelected;
		var defnsAll = world.improvementDefns;
		return (defnName == null ? null : defnsAll[defnName] );
	}

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

	Base_Improvements.prototype.toControl = function(base, world)
	{
		if (this._control == null)
		{
			this._control = new ControlContainer
			(
				"containerImprovements",
				[
					new ControlLabel
					(
						"labelImprovements",
						"Improvements Built:"
					),
					new ControlBreak(),
					new ControlSelect
					(
						"selectImprovements",
						null, // bindingGetForOptionText
						base.improvements.improvementDefnNames, // options
						3, // numberOfOptionsVisible,
						false, // allowNullSelection
						null, // bindingGetForOptionValue
						// bindingForSelectedValue
						new DataBinding
						(
							base, // context
							function get(context) 
							{
								return context.improvements.improvementDefnNameSelected;
							},
							function set(context, value) 
							{
								context.improvements.improvementDefnNameSelected = value;
							}
						)
					),
					new ControlBreak(),
					new ControlLabel("labelImprovementSelected", "Selected:"),
					new ControlLabel
					(
						"infoImprovementSelectedDescription",
						new DataBinding
						(
							[ base, world ], // context
							function get(context) 
							{
								var base = context[0];
								var world = context[1];
								var improvementDefn = base.improvements.improvementDefnSelected(world);
								var description = (improvementDefn == null ? "[none]" : improvementDefn.description);
								return description;
							}
						)
					)
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

	Base_Industry.prototype.toControl = function(base, world)
	{
		if (this._control == null)
		{
			this._control = new ControlContainer
			(
				"containerIndustry",
				[
					new ControlLabel
					(
						"labelBuilding",
						"Building:"
					),
					new ControlSelect
					(
						"selectBuilding",
						function(context) { return context.name; }, // bindingGetForOptionText
						world.buildableDefns, // options
						1, // numberOfOptionsVisible
						true, // allowNullSelection
						function(context) { return context.name; }, // bindingGetForOptionValue
						new DataBinding
						(
							base.industry,
							function get(context) { return context.buildableInProgressDefnName; },
							function set(context, value) { context.buildableInProgressDefnName = value; }
						)
					),
					new ControlLabel("labelProgress", "Progress:"),
					new ControlLabel
					(
						"infoProgress",
						new DataBinding
						(
							base, 
							function(context) { return context.industryStockpiledOverNeeded(); }
						)
					),
				]
			);
		}

		return this._control;
	}
}

function Base_Movers(moversPresent)
{
	this.moversPresent = moversPresent;
	this.moverIndexSelected = null;
}
{
	Base_Movers.prototype.moverSelected = function()
	{
		var indexSelected = this.moverIndexSelected;
		return (indexSelected == null ? null : this.moversPresent[indexSelected] );
	}

	Base_Movers.prototype.toControl = function(base, world)
	{
		if (this._control == null)
		{
			this._control = new ControlContainer
			(
				"containerMovers",
				[
					new ControlLabel
					(
						"labelUnits",
						"Units Present:"
					),
					new ControlBreak(),
					new ControlSelect
					(
						"selectUnits",
						function(context) { return context.defnName; }, // bindingGetForOptionText
						this.moversPresent,
						4, // numberOfOptionsVisible,
						false, // allowNullSelection
						function(context) { return null; }, // bindingGetForOptionValue
						// bindingForSelectedValue
						new DataBinding
						(
							base, // context
							function get(context) { return context.movers.moverIndexSelected; },
							function set(context, value) 
							{
								context.movers.moverIndexSelected = value;
							}
						)
					),
					new ControlBreak(),
					new ControlLabel("labelMoverSelected", "Selected:"),
					new ControlLabel
					(
						"infoMoverSelectedDescription",
						new DataBinding
						(
							[ base, world ], // context
							function get(context) 
							{
								var base = context[0];
								var world = context[1];
								var mover = base.movers.moverSelected(world);
								var description = (mover == null ? "[none]" : mover.defn(world).description());
								return description;
							}
						)
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
		var cellsInUse = base.usage.cellsInUse(base, world);
		var resourceGroupProducedByBase = this.resourceGroupProducedPerTurn;
		resourceGroupProducedByBase.clear();
		var map = world.map;
		for (var i = 0; i < cellsInUse.length; i++)
		{
			var cell = cellsInUse[i];
			cell.resourcesProducedPerTurnAddToGroup(resourceGroupProducedByBase, map);
		}

		var incomeAllocation = base.nation(world).incomeAllocation(world);
		incomeAllocation.resourceGroupAllocate(resourceGroupProducedByBase);

		var improvementDefns = base.improvements.improvementDefns(world);
		// todo - Sort by priority.
		for (var i = 0; i < improvementDefns.length; i++)
		{
			var improvementDefn = improvementDefns[i];
			improvementDefn.applyToResourceGroup(resourceGroupProducedByBase);
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

	Base_Usage.prototype.cellAtOffsetUseToggle = function(base, cellOffsetToToggle)
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
			if (this.offsetsOfCellsInUse.length < base.demographics.population)
			{
				this.offsetsOfCellsInUse.push(cellOffsetToToggle.clone());
			}
		}
		else
		{
			this.offsetsOfCellsInUse.remove(cellOffsetFound);
		}
	}

	Base_Usage.prototype.cellsInUse = function(base, world)
	{
		var returnValues = [];

		var map = world.map;
		var basePos = base.geography.pos;
		var cellPos = new Coords();
		for (var i = 0; i < this.offsetsOfCellsInUse.length; i++)
		{
			var cellOffsetInUse = this.offsetsOfCellsInUse[i];
			cellPos.overwriteWith(cellOffsetInUse).add(basePos);
			var cell = map.cellAtPos(cellPos);
			returnValues.push(cell);
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

	Base_Usage.prototype.toControl = function(base, world)
	{
		if (this._control == null)
		{
			var childControls = [];

			var cellOffset = new Coords();
			var buttonSize = new Coords(1, 1).multiplyScalar(50);
			var usageRadiusInCells = Base_Usage.UsageRadiusInCells;
			var centerInCells = new Coords(1, 1).multiplyScalar(usageRadiusInCells);
			var basePosInCells = base.geography.pos;
			var map = world.map;
			var zeroes = new Coords(0, 0);
			var resourceGroup = new ResourceGroup([]);
			for (var y = -usageRadiusInCells; y <= usageRadiusInCells; y++)
			{
				cellOffset.y = y;

				for (var x = -usageRadiusInCells; x <= usageRadiusInCells; x++)
				{
					cellOffset.x = x;

					var buttonForCellTextBinding = new DataBinding
					(
						[ cellOffset.clone() ], // context
						function get(context) 
						{
							var cellOffset = context[0];

							var cellPosInCells = cellOffset.clone().add(basePosInCells);
							var cell = map.cellAtPos(cellPosInCells);
							var cellTerrain = cell.terrain(map);
							var doesCellHaveRoad = cell.hasRoad;

							var returnValue = "";
							var isCellInUse = base.usage.cellAtOffsetIsInUse(cellOffset);
							if (isCellInUse)
							{
								resourceGroup.clear();
								var cellResources = cell.resourcesProducedPerTurnAddToGroup(resourceGroup, map).resources;
								var food = cellResources["Food"].quantity;
								var industry = cellResources["Industry"].quantity;
								var trade = cellResources["Trade"].quantity;
								returnValue = food + "f" + industry + "i" + trade + "t"
							}

							if (doesCellHaveRoad)
							{
								returnValue += "r";
							}
							
							if (returnValue == "")
							{
								returnValue = "&nbsp;";
							}

							return returnValue;
						}
					);

					var buttonForCellClick;
					if (cellOffset.equals(zeroes))
					{
						buttonForCellClick = function()
						{
							var usage = base.usage;
							usage.optimize(base, world);
							base.recalculate(world);
							world.update();
						};
					}
					else
					{
						buttonForCellClick = function()
						{
							var cellOffsetAsString = this.value;
							var cellOffset = new Coords().fromString(cellOffsetAsString);
							var usage = base.usage;
							usage.cellAtOffsetUseToggle(base, cellOffset);
							base.recalculate(world);
							world.update();
						};
					}

					var cellPosInCells = cellOffset.clone().add(basePosInCells);
					var cellTerrain = map.cellAtPos(cellPosInCells).terrain(map);
					var buttonForCell = new ControlButton
					(
						"button" + x + "_" + y,
						buttonSize,
						buttonForCellTextBinding,
						buttonForCellClick,
						cellOffset.clone(), // context
						cellTerrain.color
					);

					childControls.push(buttonForCell);
				}

				childControls.push(new ControlBreak());
			}

			var containerUsageCells = new ControlContainer
			(
				"containerUsageCells",
				childControls
			);

			this._control = new ControlContainer
			(
				"containerUsage",
				[
					new ControlLabel
					(
						"labelUsage",
						"Usage:"
					),

					containerUsageCells
				]
			);

		}

		return this._control;
	}
}
