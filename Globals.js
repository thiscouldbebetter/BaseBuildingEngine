
function Globals()
{
	// do nothing
}

{
	// instance

	Globals.Instance = new Globals();

	Globals.prototype.initialize = function(world)
	{
		this.world = world;

		this.world.initialize();
	}

	Globals.prototype.update = function()
	{
		this.world.update();
	}
}
