metal.ns('geo.model.Event');

/**
 * Represents a Geo Event
 * 
 * @class Event
 */
geo.model.Event = metal.extend(Object, (function() {
	
	
	return {
		
		/**
		 * @const {Integer} OPEN
		 */
		OPEN: 1,
		
		/**
		 * @const {Integer} CLOSED
		 */
		CLOSED: 0,
		
		/**
		 * @property {String} name
		 */
		name: '',
		
		/**
		 * @property {metal.model.User} owner
		 */
		owner: {}, 
		
		/**
		 * @property {Integer} state 
		 * @default OPEN 
		 */
		state: 1, // Open
		
		/**
		 * @property {String} startDate
		 */
		startDate: '',
		
		/**
		 * @property {String} endDate
		 */
		endDate: '',
		
		/**
		 * @property {String} picture
		 */
		picture: '',
		
		/**
		 * 
		 * @property {metal.model.GeoLocation} location
		 */
		location: {},
		
		/**
		 * The people registered to this event
		 * 
		 * @property {geo.model.User[]} items
		 */
		items: [],
		
		constructor: function(config) {
			metal.apply(this, config);
			dlog('Event: ' + this.name, 'constructor');
			
			// Call parent
			geo.model.Event.superclass.constructor.call(this);
		},
		
		/**
		 * 
		 * @method isOpen
		 */
		isOpen: function() {
			return this.state == this.OPEN;
		},
		
		/**
		 * @method get
		 * @param {String} name
		 */
		get: function(name) {
			return this[name] ? this[name] : this.location.get(name);
		}
		
				
	};
})());
