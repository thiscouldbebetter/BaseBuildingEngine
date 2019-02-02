
function World(incomeAllocations, improvementDefns, moverDefns, technologies, map, base)
{
	this.incomeAllocations = incomeAllocations.addLookups("name");
	this.improvementDefns = improvementDefns;
	this.moverDefns = moverDefns;
	this.technologies = technologies;
	this.map = map;
	this.base = base;

	this.buildableDefns =
		[].concat(this.improvementDefns).concat(this.moverDefns);

	this.improvementDefns.addLookups("name");
	this.moverDefns.addLookups("name");
	this.technologies.addLookups("name");
	this.buildableDefns.addLookups("name");
}
{
 	World.prototype.initialize = function()
	{
		this.base.initialize(this);
		this.update();
	}

	World.prototype.update = function()
	{
		this.draw();
	}

	// controls

	World.prototype.toControl = function()
	{
		return this.base.toControl(this);
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
