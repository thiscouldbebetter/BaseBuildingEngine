
function World(incomeAllocations, improvementDefns, moverDefns, technologies, map, nations)
{
	this.incomeAllocations = incomeAllocations.addLookups("name");
	this.improvementDefns = improvementDefns.addLookups("name");
	this.moverDefns = moverDefns.addLookups("name");
	this.technologies = technologies.addLookups("name");
	this.map = map;
	this.nations = nations.addLookups("name");

	this.buildableDefns =
		[].concat(this.improvementDefns).concat(this.moverDefns);

	this.buildableDefns.addLookups("name");

	this.nationSelectedIndex = 0;
}
{
 	World.prototype.initialize = function()
	{
		for (var i = 0; i < this.nations.length; i++)
		{
			this.nations[i].initialize(this);
		}
		this.update();
	}

	World.prototype.nationSelected = function()
	{
		return this.nations[this.nationSelectedIndex];
	}

	World.prototype.recalculate = function()
	{
		for (var i = 0; i < this.nations.length; i++)
		{
			var nation = this.nations[i];
			nation.recalculate(this);
		}
	}

	World.prototype.update = function()
	{
		this.draw();
	}

	World.prototype.updateForTurn = function()
	{
		for (var i = 0; i < this.nations.length; i++)
		{
			this.nations[i].updateForTurn(this);
		}
		this.update();
	}

	// controls

	World.prototype.toControl = function()
	{
		return this.nationSelected().toControl(this);
	}

	// drawable

	World.prototype.draw = function()
	{
		if (this._control == null)
		{
			this._control = this.toControl();
			var domElement = this._control.domElementUpdate();
			var divMain = document.getElementById("divMain");
			divMain.appendChild(domElement);
		}
		this._control.domElementUpdate();
	}
}
