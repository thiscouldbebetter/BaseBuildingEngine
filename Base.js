
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

	Base.prototype.foodProduction = function()
	{
		var base = this;
		var foodProduced = base.resources.resourceGroupProducedPerTurn.resources["Food"].quantity;
		var foodConsumed = base.demographics.population;
		var foodNet = foodProduced - foodConsumed;
		var returnValue = foodProduced + " - " + foodConsumed + " = " + foodNet;
		return returnValue;
	}

	Base.prototype.foodStockpiledOverNeededToGrow = function()
	{
		var base = this;
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

	Base.prototype.industryProduction = function()
	{
		var base = this;
		var industryProduced =
			base.resources.resourceGroupProducedPerTurn.resources["Industry"].quantity;
		var industryConsumed = 0;
		var industrySurplus = industryProduced - industryConsumed;
		var returnValue = industryProduced + " - " + industryConsumed + " = " + industrySurplus;
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

	Base.prototype.tradeProduction = function()
	{
		var base = this;
		var tradeProduced =
			base.resources.resourceGroupProducedPerTurn.resources["Trade"].quantity;
		var tradeConsumed = 0;
		var tradeSurplus = tradeProduced - tradeConsumed;
		var returnValue = tradeProduced + " - " + tradeConsumed + " = " + tradeSurplus;
		return returnValue;
	}

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

	Base.prototype.toControl = function(world)
	{
		if (this._control == null)
		{
			var base = this;

			var controlDemographics = this.demographics.toControl
			(
				this,
				world
			);

			var controlImprovements = this.improvements.toControl
			(
				this,
				world
			);

			var controlIndustry = this.industry.toControl
			(
				this,
				world
			);

			var controlUsage = this.usage.toControl
			(
				this,
				world
			);

			var controlMovers = new ControlContainer
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
						"defnName", // bindingExpressionForOptionText
						base.moversPresent,
						4 // numberOfOptionsVisible
					),
				]
			);

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
					new ControlLabelDynamic
					(
						"infoFood",
						new DataBinding(base, "foodProduction()")
					),
					new ControlBreak(),

					new ControlLabel
					(
						"labelIndustry",
						"Industry:"
					),
					new ControlLabelDynamic
					(
						"infoIndustry",
						new DataBinding(base, "industryProduction()")
					),
					new ControlBreak(),

					new ControlLabel
					(
						"labelTrade",
						"Trade:"
					),
					new ControlLabelDynamic
					(
						"infoTrade",
						new DataBinding(base, "tradeProduction()")
					),
					new ControlBreak(),

				]
			);

			var buttonTurnAdvance = new ControlButton
			(
				"buttonTurnAdvance",
				"Next Turn",
				function click()
				{
					base.updateForTurn(world);
				}
			);

			this._control = new ControlContainer
			(
				"containerBase",
				[
					new ControlLabel
					(
						"labelName",
						"Name:"
					),
					new ControlLabel
					(
						"infoName",
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
					new ControlLabelDynamic
					(
						"infoPopulation",
						new DataBinding(base.demographics, "population")
					),
					new ControlBreak(),

					new ControlLabel
					(
						"labelFood",
						"Food:"
					),
					new ControlLabelDynamic
					(
						"infoFood",
						new DataBinding(base, "foodStockpiledOverNeededToGrow()")
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
						null, // bindingExpressionForOptionText
						base.improvements.improvementDefnNames, // options
						3 // numberOfOptionsVisible
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
						"name", // bindingExpressionForOptionText
						world.buildableDefns, // options
						1, // numberOfOptionsVisible
						true, // allowNullSelection
						"name", // bindingExpressionForOptionValue
						new DataBinding(base.industry, "buildableInProgressDefnName") // bindingForSelectedValue
					),
					new ControlLabel
					(
						"labelProgress",
						"Progress:"
					),
					new ControlLabelDynamic
					(
						"infoProgress",
						new DataBinding(base, "industryStockpiledOverNeeded()")
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

	Base_Usage.prototype.toControl = function(base, world)
	{
		if (this._control == null)
		{
			var childControls = [];

			var cellOffset = new Coords();
			var buttonSize = new Coords(1, 1).multiplyScalar(40);
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
						buttonForCellClick = function click()
						{
							var cellOffset = this.value;
							var usage = base.usage;
							usage.cellAtOffsetUseToggle(cellOffset);
							base.recalculate(world);
						};
					}

					var buttonForCell = new ControlButton
					(
						"button" + x + "_" + y,
						buttonSize,
						cellText,
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
