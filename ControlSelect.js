
function ControlSelect
(
	name,
	bindingExpressionForOptionText,
	options,
	numberOfOptionsVisible,
	allowNullSelection,
	bindingExpressionForOptionValue,
	bindingForSelectedValue
)
{
	this.name = name;
	this.bindingExpressionForOptionText = bindingExpressionForOptionText;
	this.options = options;
	this.numberOfOptionsVisible = (numberOfOptionsVisible == null ? 1 : numberOfOptionsVisible);
	this.allowNullSelection = (allowNullSelection == null ? false : allowNullSelection);
	this.bindingExpressionForOptionValue = bindingExpressionForOptionValue;
	this.bindingForSelectedValue = bindingForSelectedValue;
}

{
	ControlSelect.OptionNoneValueAndText = "[none]";

	ControlSelect.prototype.domElementUpdate = function()
	{
		if (this._domElement == null)
		{
			var _domElement = document.createElement("select");
			_domElement.size = this.numberOfOptionsVisible;
			var bindingForSelectedValue = this.bindingForSelectedValue;
			_domElement.onchange = function(todo)
			{
				var valueSelected = _domElement.value;
				if (valueSelected == ControlSelect.OptionNoneValueAndText)
				{
					valueSelected = null;
				}
				bindingForSelectedValue.set(valueSelected);
				// hack
				var world = Globals.Instance.world;
				world._control = null;
				world.update();
			}

			if (this.allowNullSelection)
			{
				var optionNone = document.createElement("option");
				optionNone.innerHTML = ControlSelect.OptionNoneValueAndText;
				_domElement.appendChild(optionNone);
			}

			for (var i = 0; i < this.options.length; i++)
			{
				var option = this.options[i];
				var optionAsDomElement = document.createElement("option");

				var optionText = option;
				if (this.bindingExpressionForOptionText != null)
				{
					optionText = optionText[this.bindingExpressionForOptionText];
				}
				optionAsDomElement.innerHTML = optionText;

				optionValue = option;
				if (this.bindingExpressionForOptionValue != null)
				{
					optionValue = optionValue[this.bindingExpressionForOptionValue];
				}
				optionAsDomElement.value = optionValue;

				_domElement.appendChild(optionAsDomElement);
			}

			this._domElement = _domElement;
		}

		return this._domElement;
	}
}
