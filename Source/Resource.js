
function Resource(defnName, quantity)
{
	this.defnName = defnName;
	this.quantity = quantity;
}
{
	Resource.prototype.clone = function()
	{
		return new Resource(this.defnName, this.quantity);
	}
}