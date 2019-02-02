
function DataBinding(context, get, set)
{
	this.context = context;
	this._get = get;
	this._set = set;
}
{
	DataBinding.prototype.get = function()
	{
		var returnValue;
		if (this._get == null)
		{
			returnValue = this.context;
		}
		else
		{
			returnValue = this._get(this.context);
		}
		return returnValue;
	}

	DataBinding.prototype.set = function(valueToSet)
	{
		if (this._set == null)
		{
			this.context = valueToSet;
		}
		else
		{
			this._set(this.context, valueToSet);
		}
	}
}
