function Nation(name, incomeAllocationName, wealthStockpiled, technologyBeingResearchedName, researchStockpiled, technologiesKnownNames, bases)
{
	this.name = name;
	this.incomeAllocationName = incomeAllocationName;
	this.wealthStockpiled = wealthStockpiled;
	this.technologyBeingResearchedName = technologyBeingResearchedName;
	this.researchStockpiled = researchStockpiled;
	this.technologiesKnownNames = technologiesKnownNames;
	this.bases = bases;

	this.baseIndexSelected = 0;
}
{
	Nation.prototype.baseCapital = function()
	{
		var baseCapitalIndex = 0; // todo
		return this.bases[baseCapitalIndex];
	}

	Nation.prototype.baseSelect = function(baseToSelect, world)
	{
		var baseToSelectIndex = this.bases.indexOf(baseToSelect);
		if (baseToSelectIndex >= 0)
		{
			this.baseIndexSelected = baseToSelectIndex;
		}
		this._control = null; // hack
		world.recalculate();
		world.update();
	}

	Nation.prototype.baseSelected = function()
	{
		return this.bases[this.baseIndexSelected];
	}

	Nation.prototype.incomeAllocation = function(world)
	{
		return world.incomeAllocations[this.incomeAllocationName];
	}

	Nation.prototype.initialize = function(world)
	{
		for (var i = 0; i < this.bases.length; i++)
		{
			this.bases[i].initialize(world, this);
		}
	}

	Nation.prototype.recalculate = function(world)
	{
		for (var i = 0; i < this.bases.length; i++)
		{
			var base = this.bases[i];
			base.recalculate(world);
		}
	}

	Nation.prototype.researchPerTurn = function(world)
	{
		var returnValue = 0;
		for (var i = 0; i < this.bases.length; i++)
		{
			returnValue += this.bases[i].taxesPerTurn(world, nation);
		}
		return returnValue;
	}

	Nation.prototype.researchStockpiledOverNeeded = function(world)
	{
		var researchNeeded;
		var techBeingResearched = this.technologyBeingResearched(world);
		if (techBeingResearched == null)
		{
			researchNeeded = "-";
		}
		else
		{
			researchNeeded = techBeingResearched.researchToDiscover;
		}
		returnValue = this.researchStockpiled + "/" + researchNeeded;

		return returnValue;
	}

	Nation.prototype.taxesPerTurn = function(world)
	{
		var returnValue = 0;
		for (var i = 0; i < this.bases.length; i++)
		{
			returnValue += this.bases[i].taxesPerTurn(world, nation);
		}
		return returnValue;
	}

	Nation.prototype.technologyBeingResearched = function(world)
	{
		var techName = this.technologyBeingResearchedName;
		return (techName == null ? null : world.technologies[techName]);
	}

	Nation.prototype.updateForTurn = function(world)
	{
		var researchPerTurn = this.researchPerTurn(world);
		this.researchStockpiled += researchPerTurn;
		var techBeingResearched = this.technologyBeingResearched(world);
		if (techBeingResearched != null)
		{
			var researchToDiscover = techBeingResearched.researchToDiscover;
			if (this.researchStockpiled >= researchToDiscover)
			{
				this.researchStockpiled -= researchToDiscover;
				this.technologiesKnownNames.push(this.technologyBeingResearchedName);
				this.technologyBeingResearchedName = null;
			}
		}

		var taxesPerTurn = this.taxesPerTurn(world);
		this.wealthStockpiled += taxesPerTurn;
	}

	// controls

	Nation.prototype.toControl = function(world)
	{
		if (this._control == null)
		{
			var controlBaseSelect = new ControlContainer
			(
				"containerBaseSelect",
				[
					new ControlLabel("labelName", "Base Selected:"),
					new ControlSelect
					(
						"selectBase", 
						function(context) { return context.name; }, // bindingGetForOptionText
						this.bases, // options
						1, // numberOfOptionsVisible
						false, // allowNullSelection
						function(context) { return context; }, // bindingGetForOptionValue
						new DataBinding
						(
							this,
							function get(context) { return context.baseSelected(world); },
							function set(context, value) { context.baseSelect(value, world); }
						) // bindingForSelectedValue
					)
				]
			);
			var controlBaseSelected = this.baseSelected().toControl(world);

			this._control = new ControlContainer
			(
				"containerNation",
				[
					new ControlLabel("labelName", "Nation:"),
					new ControlLabel("infoName", this.name),
					new ControlBreak(),
					new ControlLabel("labelTreasury", "Treasury:"),
					new ControlLabel
					(
						"infoTreasury",
						new DataBinding
						(
							this, // context
							function get(context) { return context.wealthStockpiled; },
							function set(context, value) { context.wealthStockpiled = value; }
						)
					),
					new ControlBreak(),
					new ControlLabel("labelIncomeAllocation", "Income Allocation:"),
					new ControlSelect
					(
						"selectResearchRate",
						function(context) { return context.name; }, // bindingGetForOptionText
						world.incomeAllocations, // options
						1, // numberOfOptionsVisible
						false, // allowNullSelection
						function(context) { return context; }, // bindingGetForOptionValue
						new DataBinding
						(
							this,
							function get(context) { return context.incomeAllocation(world); },
							function set(context, value) { context.incomeAllocationName = value; }
						) // bindingForSelectedValue
					),
					new ControlBreak(),
					new ControlLabel("labelResearching", "Researching:"),
					new ControlSelect
					(
						"selectResearching",
						function(context) { return context.name; }, // bindingGetForOptionText
						world.technologies, // options
						1, // numberOfOptionsVisible
						true, // allowNullSelection
						function(context) { return context.name; }, // bindingGetForOptionValue
						new DataBinding
						(
							this,
							function get(context) { return context.technologyBeingResearchedName; },
							function set(context, value) { context.technologyBeingResearchedName = value; }
						)
					),
					new ControlLabel("labelResearchProgress", "Progress:"),
					new ControlLabel
					(
						"infoResearchProgress",
						new DataBinding
						(
							this, 
							function(context) { return context.researchStockpiledOverNeeded(world); }
						)
					),
					controlBaseSelect,
					controlBaseSelected,
				]
			);
		}

		return this._control;
	}
}
