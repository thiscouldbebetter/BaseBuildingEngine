
function DataBinding(context, bindingExpression)
{
	this.context = context;
	this.bindingExpression = bindingExpression;
}
{
	DataBinding.prototype.get = function()
	{
		var returnValue = this.context;
		if (this.bindingExpression == null)
		{
			// Do nothing.
		}
		else if (this.bindingExpression.endsWith("()"))
		{
			var bindingExpressionTrimmed = this.bindingExpression.substr(0, this.bindingExpression.length - 2);
			returnValue = returnValue[bindingExpressionTrimmed]();
		}
		else
		{
			returnValue = returnValue[this.bindingExpression];
		}
		return returnValue;
	}

	DataBinding.prototype.set = function(valueToSet)
	{
		if (this.bindingExpression == null)
		{
			// Do nothing.
		}
		else if (this.bindingExpression.endsWith("()"))
		{
			// Do nothing.
		}
		else
		{
			this.context[this.bindingExpression] = valueToSet;
		}
	}
}
