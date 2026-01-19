from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
from dotenv import load_dotenv
from modules.statistics import process_statistics
# Load environment variables from .env file
load_dotenv()

# Add modules directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'modules'))

# Import our custom modules
from calculus import process_calculus
from algebra import process_algebra
from geometry import process_geometry
from vectors import process_vectors

# Import AI parser
from ai_parser import parse_with_ai, fallback_parser, validate_geometry_format

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Configuration
USE_AI_PARSER = True  # Set to False to use only fallback parser

@app.route('/')
def home():
    return "Math Visualizer Backend is Running! 🚀"

@app.route('/api/visualize', methods=['POST'])
def visualize():
    """
    Main endpoint that receives LaTeX input and module type
    Returns visualization data
    
    NEW: Now supports AI-powered parsing of natural language inputs
    """
    try:
        # Get data from frontend
        data = request.get_json()
        original_input = data.get('latex', '')
        module_type = data.get('module', '')
        use_ai = data.get('use_ai', USE_AI_PARSER)  # Allow frontend to override
        
        print(f"Received: Module={module_type}, Original Input={original_input}")
        
        # Parse input using AI or fallback
        parsed_input = original_input
        parsing_method = "original"
        
        if use_ai:
            try:
                parsed_input = parse_with_ai(original_input, module_type)
                parsing_method = "ai"
                print(f"AI Parsed: {parsed_input}")
                
                # Validate geometry format
                if module_type == 'geometry':
                    is_valid, error_msg = validate_geometry_format(parsed_input)
                    if not is_valid:
                        print(f"AI parsing validation failed: {error_msg}")
                        # Fall back to rule-based parser
                        parsed_input = fallback_parser(original_input, module_type)
                        parsing_method = "fallback"
                        print(f"Fallback Parsed: {parsed_input}")
                
            except Exception as e:
                print(f"AI parsing failed: {str(e)}, using fallback parser")
                parsed_input = fallback_parser(original_input, module_type)
                parsing_method = "fallback"
                print(f"Fallback Parsed: {parsed_input}")
        else:
            # Use fallback parser
            parsed_input = fallback_parser(original_input, module_type)
            parsing_method = "fallback"
            print(f"Fallback Parsed: {parsed_input}")
        
        # Route to appropriate module with parsed input
        if module_type == 'calculus':
            result = process_calculus(parsed_input)
        elif module_type == 'algebra':
            result = process_algebra(parsed_input)
        elif module_type == 'geometry':
            result = process_geometry(parsed_input)
        elif module_type == 'vectors':
            result = process_vectors(parsed_input)
        else:
            return jsonify({
                'success': False,
                'error': f'Unknown module type: {module_type}'
            }), 400
        
        # Add parsing info to result
        result['parsing_info'] = {
            'original_input': original_input,
            'parsed_input': parsed_input,
            'method': parsing_method
        }
        
        return jsonify({
            'success': True,
            'data': result
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/parse', methods=['POST'])
def parse_only():
    """
    Endpoint to test AI parsing without running visualization
    Useful for debugging
    """
    try:
        data = request.get_json()
        user_input = data.get('input', '')
        module_type = data.get('module', 'geometry')
        
        # Try AI parsing
        try:
            ai_parsed = parse_with_ai(user_input, module_type)
            ai_success = True
        except Exception as e:
            ai_parsed = str(e)
            ai_success = False
        
        # Try fallback parsing
        fallback_parsed = fallback_parser(user_input, module_type)
        
        return jsonify({
            'success': True,
            'original_input': user_input,
            'ai_parsing': {
                'success': ai_success,
                'result': ai_parsed
            },
            'fallback_parsing': {
                'result': fallback_parsed
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if server is running"""
    
    has_mistral_key = bool(os.getenv("MISTRAL_API_KEY"))
    
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running properly',
        'ai_parser_available': has_mistral_key,
        'features': {
            'ai_parsing': has_mistral_key,
            'fallback_parsing': True,
            'modules': ['calculus', 'algebra', 'geometry', 'vectors']
        }
    })

@app.route('/api/statistics', methods=['POST'])
def handle_statistics():
    """Handle statistics and probability requests"""
    try:
        data = request.json
        operation = data.get('operation')
        
        if operation == 'descriptive':
            # Descriptive statistics
            result = process_statistics(data.get('data'), 'descriptive')
        
        elif operation == 'normal_distribution':
            # Normal distribution
            result = process_statistics(data.get('params'), 'normal_distribution')
        
        elif operation == 'binomial_distribution':
            # Binomial distribution
            result = process_statistics(data.get('params'), 'binomial_distribution')
        
        elif operation == 'poisson_distribution':
            # Poisson distribution
            result = process_statistics(data.get('params'), 'poisson_distribution')
        
        elif operation == 'hypothesis_test':
            # Hypothesis testing
            result = process_statistics(data.get('params'), 'hypothesis_test')
        
        elif operation == 'regression':
            # Regression analysis
            result = process_statistics(data.get('params'), 'regression')
        
        elif operation == 'correlation':
            # Correlation analysis
            result = process_statistics(data.get('params'), 'correlation')
        
        else:
            return jsonify({
                'success': False,
                'error': f'Unknown operation: {operation}'
            }), 400
        
        return jsonify({
            'success': True,
            'data': result
        })
    
    except Exception as e:
        print(f"Statistics error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/statistics/test', methods=['GET'])
def test_statistics():
    """Test statistics module with sample data"""
    try:
        # Test descriptive statistics
        sample_data = "23, 45, 67, 34, 56, 78, 90, 12, 45, 67, 89, 34, 56"
        result = process_statistics(sample_data, 'descriptive')
        
        return jsonify({
            'success': True,
            'message': 'Statistics module working!',
            'sample_result': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Math Visualizer Backend Starting...")
    print("📍 Server running at: http://localhost:5000")
    print("=" * 60)
    
    # Check for Mistral API key
    if os.getenv("MISTRAL_API_KEY"):
        print("✅ Mistral AI Parser: ENABLED")
        print("   API Key loaded from .env file")
    else:
        print("⚠️  Mistral AI Parser: DISABLED (no API key)")
        print("   Add MISTRAL_API_KEY to .env file to enable")
        print("   Fallback rule-based parser will be used")
    
    print("=" * 60)
    
    app.run(debug=True, port=5000, host='0.0.0.0')